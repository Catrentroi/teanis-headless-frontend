/**
 * /api/graphql
 * GraphQL Proxy: Chuyển tiếp query GraphQL từ trình duyệt sang WordPress CMS.
 * → Trình duyệt chỉ gọi cùng domain Nuxt (teanis.com/api/graphql), triệt tiêu 100% rủi ro CORS.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const endpoint = config.public.wpGraphqlUrl || 'http://headless-landing.local/graphql'

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
