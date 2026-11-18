<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchAboutPage } = useAboutPage()
const { data: pageData } = await useAsyncData('about-page-data', () => fetchAboutPage('/about-us'))
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://teanis.com'
const pageUrl = `${siteUrl}/about`

const pageTitle = computed(() => {
  return pageData.value?.seo?.title || (pageData.value?.hero?.title ? `${pageData.value.hero.title} — Về chúng tôi — Teanis Technologies` : 'Giới thiệu về chúng tôi — Teanis Technologies')
})

const pageDescription = computed(() => {
  return pageData.value?.seo?.metaDesc || pageData.value?.hero?.description || 'Tìm hiểu về sứ mệnh, tầm nhìn và các giá trị cốt lõi của Teanis Technologies.'
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
    return pageData.value.seo.canonical.replace(/^https?:\/\/[^\/]+/, siteUrl)
  }
  return pageUrl
})

const schemaJson = computed(() => {
  if (pageData.value?.seo?.schemaRaw) {
    const wpDomain = config.public.wpDomain || 'headless-landing.local'
    return pageData.value.seo.schemaRaw.replaceAll(`http://${wpDomain}`, siteUrl).replaceAll(`https://${wpDomain}`, siteUrl)
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
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
