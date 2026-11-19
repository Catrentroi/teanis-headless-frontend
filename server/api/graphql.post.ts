/**
 * /api/graphql
 * GraphQL Proxy: Chuyển tiếp query GraphQL từ trình duyệt sang WordPress CMS.
 * → Trình duyệt chỉ gọi cùng domain Nuxt (teanis.com/api/graphql), triệt tiêu 100% rủi ro CORS.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const endpoint = (config.wpGraphqlUrl as string) || (config.public as any)?.wpGraphqlUrl || 'http://headless-landing.local/graphql'

  const queryStr = String(body?.query || '')

  // 1. Bảo mật: Chặn đứng mọi hành vi dò tìm cây trường ACF / Schema Introspection
  if (/__schema|__type/i.test(queryStr)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'GraphQL introspection queries are forbidden.'
    })
  }

  // 2. Bảo mật: Chặn đứng truy vấn danh mục tài khoản Admin / User
  if (/\busers\b/i.test(queryStr)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User directory queries are forbidden.'
    })
  }

  try {
    const response = await $fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })
    return response
  } catch (err: any) {
    throw createError({
      statusCode: err?.status || 502,
      statusMessage: 'Upstream GraphQL Error: ' + (err?.data?.message || err?.message)
    })
  }
})
