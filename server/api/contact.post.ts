export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // 1. Kiểm tra Honeypot chống bot tự động điền form
  if (body?._hp) {
    // Trả về success giả lập để bot không tiếp tục spam
    return { success: true, message: 'Message sent' }
  }

  // 2. Validate dữ liệu đầu vào bắt buộc
  const fullName = String(body?.fullName || '').trim()
  const email = String(body?.email || '').trim()
  const phone = String(body?.phone || '').trim()
  const companyName = String(body?.companyName || '').trim()
  const industry = String(body?.industry || '').trim()
  const requirement = String(body?.requirement || '').trim()

  if (!fullName || !email || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng điền đầy đủ họ tên, email và số điện thoại.'
    })
  }

  // 3. Đồng bộ lưu vào WordPress Custom Post Type qua REST API
  const graphqlUrl = (config.wpGraphqlUrl as string) || ''
  const inferredApiUrl = graphqlUrl ? graphqlUrl.replace(/\/graphql\/?$/, '/wp-json') : ''
  const wpApiUrl = ((config.wpApiUrl as string) || inferredApiUrl || (config.public as any)?.wpApiUrl || 'http://headless-landing.local/wp-json').replace(/\/$/, '')
  const wpEndpoint = `${wpApiUrl}/teanis/v1/contact-submissions`
  const secret = config.wpHeadlessSecret

  if (!secret) {
    console.error('[Contact API] Missing WP_HEADLESS_SECRET in runtimeConfig.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Server security configuration error.'
    })
  }

  let wpResult = null
  try {
    wpResult = await $fetch(wpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Headless-Secret': secret
      },
      body: {
        fullName,
        email,
        phone,
        companyName,
        industry,
        requirement
      }
    })
  } catch (err: any) {
    console.error('[Contact API] Failed to store in WordPress:', err?.message || err)
    throw createError({
      statusCode: 502,
      statusMessage: 'Không thể lưu vào WordPress: ' + (err?.data?.message || err?.message || 'Upstream Error')
    })
  }

  // 4. Gửi email thông báo (nếu có cấu hình SMTP)
  const receiveEmail = config.contactReceiveEmail || 'trieuncn@teanis.vn'
  if (config.smtpUser && config.smtpPass) {
    try {
      let nodemailer: any = null
      try {
        // @ts-ignore
        nodemailer = await import('nodemailer')
      } catch {
        console.warn('[Contact API] nodemailer is not installed. Skipping direct SMTP dispatch.')
      }

      if (nodemailer?.createTransport) {
        const transporter = nodemailer.createTransport({
          host: config.smtpHost || 'smtp.gmail.com',
          port: Number(config.smtpPort || 465),
          secure: Number(config.smtpPort || 465) === 465,
          auth: {
            user: config.smtpUser,
            pass: config.smtpPass
          }
        })

        await transporter.sendMail({
          from: `"Teanis Website" <${config.smtpUser}>`,
          to: receiveEmail,
          replyTo: email,
          subject: `[Teanis Contact] Yêu cầu liên hệ mới từ ${fullName}`,
          html: `
            <h2>Thông tin liên hệ mới từ Website Teanis</h2>
            <p><strong>Họ và tên:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Số điện thoại:</strong> ${phone}</p>
            <p><strong>Tên công ty:</strong> ${companyName || '—'}</p>
            <p><strong>Lĩnh vực:</strong> ${industry || '—'}</p>
            <p><strong>Nội dung yêu cầu:</strong></p>
            <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #00d1bc;">
              ${requirement ? requirement.replace(/\n/g, '<br>') : 'Không có'}
            </blockquote>
          `
        })
      }
    } catch (mailErr: any) {
      console.error('[Contact API] Failed to send email via SMTP:', mailErr?.message || mailErr)
    }
  }

  return {
    success: true,
    message: 'Gửi thông tin liên hệ thành công!',
    leadId: (wpResult as any)?.id || null
  }
})
