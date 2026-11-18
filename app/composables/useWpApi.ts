export const useWpApi = () => {
  const config = useRuntimeConfig()
  const endpoint = config.public.wpGraphqlUrl || 'http://headless-landing.local/graphql'

  const query = async <T = any>(document: string, variables?: Record<string, any>): Promise<T> => {
    const res = await $fetch<{ data: T; errors?: Array<{ message: string }> }>(endpoint, {
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
