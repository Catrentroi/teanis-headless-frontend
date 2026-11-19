/**
 * /api/media?url=<WP_MEDIA_URL>
 * Image proxy: Fetch ảnh từ WordPress (Pantheon/LocalWP) và trả về cùng domain FE.
 * → Trình duyệt chỉ gọi cùng domain Vercel, không bao giờ bị CORS / NotSameOrigin.
 */
export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing url param' })
  }

  // Chỉ cho phép proxy ảnh từ domain WordPress đã cấu hình (bảo mật cơ bản)
  const config = useRuntimeConfig()
  const allowedDomain = (config.wpDomain as string) || (config.public as any)?.wpDomain || 'headless-landing.local'
  let targetUrl: URL

  try {
    targetUrl = new URL(url)
  } catch {
    throw createError({ statusCode: 400, message: 'Invalid url param' })
  }

  const isAllowed =
    targetUrl.hostname === allowedDomain ||
    targetUrl.hostname.endsWith('.' + allowedDomain) ||
    targetUrl.hostname.endsWith('.pantheonsite.io') ||
    targetUrl.hostname.endsWith('.local')

  if (!isAllowed) {
    throw createError({ statusCode: 403, message: 'Domain not allowed' })
  }

  // Fetch ảnh từ WP (server-to-server không bị Cloudflare chặn)
  let response: Response
  try {
    response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'NuxtMediaProxy/1.0',
        Accept: 'image/*,*/*'
      }
    })
  } catch (err: any) {
    throw createError({ statusCode: 502, message: 'Failed to fetch media: ' + err?.message })
  }

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: 'Upstream returned ' + response.status })
  }

  const contentType = response.headers.get('content-type') || 'image/webp'
  const buffer = await response.arrayBuffer()

  // Cache 7 ngày trên CDN Vercel
  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400')
  setHeader(event, 'X-Media-Proxy', 'teanis-nuxt')

  return new Uint8Array(buffer)
})
