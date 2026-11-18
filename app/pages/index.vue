<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchAboutPage } = useAboutPage()
const { data: pageData } = await useAsyncData('about-page-data', () => fetchAboutPage('/'))
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://teanis.com'

const pageTitle = computed(() => {
  return pageData.value?.seo?.title || (pageData.value?.hero?.title ? `${pageData.value.hero.title} — Teanis Technologies` : 'Teanis Technologies — Định hình tương lai công nghệ số')
})

const pageDescription = computed(() => {
  return pageData.value?.seo?.metaDesc || pageData.value?.hero?.description || 'Teanis Technologies mang đến các giải pháp công nghệ đổi mới, linh hoạt và bứt phá cho doanh nghiệp toàn cầu.'
})

const pageOgTitle = computed(() => {
  return pageData.value?.seo?.opengraphTitle || pageTitle.value
})

const pageOgDescription = computed(() => {
  return pageData.value?.seo?.opengraphDescription || pageDescription.value
})

const pageOgImage = computed(() => {
  return pageData.value?.seo?.opengraphImage || `${siteUrl}/images/og-share-teanis.webp`
})

const canonicalUrl = computed(() => {
  if (pageData.value?.seo?.canonical) {
    // Nếu canonical từ Yoast là link local WP thì rewrite sang siteUrl của FE
    return pageData.value.seo.canonical.replace(/^https?:\/\/[^\/]+/, siteUrl)
  }
  return siteUrl
})

const schemaJson = computed(() => {
  if (pageData.value?.seo?.schemaRaw) {
    // Thay thế domain CMS trong raw schema sang domain FE Nuxt
    const wpDomain = config.public.wpDomain || 'headless-landing.local'
    return pageData.value.seo.schemaRaw.replaceAll(`http://${wpDomain}`, siteUrl).replaceAll(`https://${wpDomain}`, siteUrl)
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Teanis Technologies',
        url: siteUrl,
        logo: `${siteUrl}/images/Teanis_horizontal.svg`,
        description: 'Dẫn đầu trong việc mang đến giải pháp công nghệ đổi mới, bền vững cho khách hàng trên toàn cầu.',
        sameAs: [
          'https://www.facebook.com/teanis.technologies',
          'https://www.linkedin.com/company/teanis-technologies/posts/?feedView=all',
          'https://www.youtube.com/@teanistechnologies'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Teanis Technologies',
        publisher: { '@id': `${siteUrl}/#organization` }
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: pageTitle.value,
        description: pageDescription.value,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` }
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
  ogUrl: () => siteUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => pageOgTitle.value,
  twitterDescription: () => pageOgDescription.value,
  twitterImage: () => pageOgImage.value
})

useHead({
  htmlAttrs: { lang: 'vi' },
  link: [
    { rel: 'canonical', href: () => canonicalUrl.value }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: () => schemaJson.value
    }
  ]
})
</script>

<template>
  <main v-if="pageData">
    <HeroSection
      :badge="pageData.hero?.badge"
      :title="pageData.hero?.title"
      :description="pageData.hero?.description"
      :cta-text="pageData.hero?.ctaText"
      :cta-link="pageData.hero?.ctaLink"
      :illustration="pageData.hero?.illustration"
      :bg-color="pageData.hero?.bgColor"
      :bg-image="pageData.hero?.bgImage"
      :hashtags="pageData.hashtags"
    />

    <CompanyInfoSection
      :subtitle="pageData.company?.subtitle"
      :title="pageData.company?.title"
      :phonetic="pageData.company?.phonetic"
      :audio-url="pageData.company?.audioUrl"
      :company-name="pageData.company?.name"
      :description="pageData.company?.description"
      :pillars-title="pageData.company?.pillarsTitle"
      :pillars="pageData.company?.pillars"
      :commitments-title="pageData.company?.commitmentsTitle"
      :commitments="pageData.company?.commitments"
      :profile-note="pageData.company?.profileNote"
      :video-poster="pageData.company?.videoPoster"
      :video-url="pageData.company?.videoUrl"
      :cta-text="pageData.company?.ctaText"
      :cta-link="pageData.company?.ctaLink"
      :bg-color="pageData.company?.bgColor"
      :bg-image="pageData.company?.bgImage"
    />

    <MetricsSection
      :metrics="pageData.metrics"
      :bg-color="pageData.metricsBgColor"
    />

    <TimelineSection
      :subtitle="pageData.timeline?.subtitle"
      :title="pageData.timeline?.title"
      :description="pageData.timeline?.description"
      :items="pageData.timeline?.items"
      :bg-color="pageData.timeline?.bgColor"
    />

    <VisionMissionSection
      :subtitle="pageData.visionMission?.subtitle"
      :title="pageData.visionMission?.title"
      :description="pageData.visionMission?.description"
      :vision-title="pageData.visionMission?.visionTitle"
      :vision-text="pageData.visionMission?.visionText"
      :vision-icon="pageData.visionMission?.visionIcon"
      :mission-title="pageData.visionMission?.missionTitle"
      :mission-items="pageData.visionMission?.missionItems"
      :mission-icon="pageData.visionMission?.missionIcon"
      :bg-color="pageData.visionMission?.bgColor"
    />

    <CoreValuesSection
      :subtitle="pageData.coreValues?.subtitle"
      :title="pageData.coreValues?.title"
      :values="pageData.coreValues?.values"
      :bg-color="pageData.coreValues?.bgColor"
    />

    <BrandPhilosophySection
      :subtitle="pageData.philosophy?.subtitle"
      :title="pageData.philosophy?.title"
      :intro="pageData.philosophy?.intro"
      :brand-logo="pageData.philosophy?.brandLogo"
      :story-text="pageData.philosophy?.storyText"
      :symbol-title="pageData.philosophy?.symbolTitle"
      :symbol-desc="pageData.philosophy?.symbolDesc"
      :symbol-icon="pageData.philosophy?.symbolIcon"
      :closing-text="pageData.philosophy?.closingText"
      :bg-color="pageData.philosophy?.bgColor"
    />

    <PreFooterCtaSection
      :illustration="pageData.preFooterCta?.illustration"
      :heading="pageData.preFooterCta?.heading"
      :subheading="pageData.preFooterCta?.subheading"
      :button-text="pageData.preFooterCta?.buttonText"
      :button-link="pageData.preFooterCta?.buttonLink"
      :bg-color="pageData.preFooterCta?.bgColor"
    />
  </main>
</template>
