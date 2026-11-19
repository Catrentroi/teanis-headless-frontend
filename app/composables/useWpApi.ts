export const useWpApi = () => {
  const config = useRuntimeConfig()
  const directEndpoint = (config.wpGraphqlUrl as string) || (config.public as any)?.wpGraphqlUrl || 'http://headless-landing.local/graphql'

  const query = async <T = any>(document: string, variables?: Record<string, any>): Promise<T> => {
    // Client-side (Trình duyệt): Luôn gọi qua Nitro proxy nội bộ để 100% không bị CORS
    // Server-side (SSR / ISR): Gọi trực tiếp sang WordPress CMS để tối ưu hiệu năng
    const targetUrl = import.meta.client ? '/api/graphql' : directEndpoint

    const res = await $fetch<{ data: T; errors?: Array<{ message: string }> }>(targetUrl, {
      method: 'POST',
      body: { query: document, variables }
    })

    if (res.errors?.length) {
      throw new Error(res.errors[0].message)
    }

    return res.data
  }

  return { query }
}
