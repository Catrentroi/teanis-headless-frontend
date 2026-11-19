import { computed } from 'vue'

export interface PageSeoOptions {
  title?: string
  description?: string
  image?: string
  pagePath?: string
  schemaType?: string
}

export function usePageSeo(seoData?: any, options: PageSeoOptions = {}) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://teanis.com'
  const wpDomain = (config.wpDomain as string) || (config.public as any)?.wpDomain || 'headless-landing.local'

  const pagePath = options.pagePath || ''
  const pageUrl = `${siteUrl}${pagePath === '/' ? '' : pagePath}`

  const pageTitle = computed(() => {
    if (seoData?.title) return seoData.title
    return options.title ? `${options.title} — Teanis Technologies` : 'Teanis Technologies — Định hình tương lai công nghệ số'
  })

  const pageDescription = computed(() => {
    return seoData?.metaDesc || options.description || 'Teanis Technologies mang đến các giải pháp công nghệ đổi mới, linh hoạt và bứt phá cho doanh nghiệp toàn cầu.'
  })

  const pageOgTitle = computed(() => seoData?.opengraphTitle || pageTitle.value)
  const pageOgDescription = computed(() => seoData?.opengraphDescription || pageDescription.value)
  const pageOgImage = computed(() => seoData?.opengraphImage || options.image || `${siteUrl}/images/og-share-teanis.webp`)

  const canonicalUrl = computed(() => {
    if (seoData?.canonical) {
      return seoData.canonical.replace(/^https?:\/\/[^\/]+/, siteUrl)
    }
    return pageUrl
  })

  const schemaJson = computed(() => {
    if (seoData?.schemaRaw) {
      return seoData.schemaRaw.replaceAll(`http://${wpDomain}`, siteUrl).replaceAll(`https://${wpDomain}`, siteUrl)
    }
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': options.schemaType || 'WebPage',
          '@id': `${pageUrl}/#webpage`,
          url: pageUrl,
          name: pageTitle.value,
          description: pageDescription.value,
          isPartOf: { '@id': `${siteUrl}/#website` }
        }
      ]
    })
  })

  useSeoMeta({
    title: () => pageTitle.value,
    description: () => pageDescription.value,
    ogTitle: () => pageOgTitle.value,
    ogDescription: () => pageOgDescription.value,
    ogImage: () => pageOgImage.value,
    ogUrl: () => pageUrl,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: () => pageOgTitle.value,
    twitterDescription: () => pageOgDescription.value,
    twitterImage: () => pageOgImage.value
  })

  useHead({
    htmlAttrs: { lang: 'vi' },
    link: [{ rel: 'canonical', href: () => canonicalUrl.value }],
    script: [{ type: 'application/ld+json', children: () => schemaJson.value }]
  })
}
