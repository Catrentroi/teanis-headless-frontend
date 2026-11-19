<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchAboutPage } = useAboutPage()
const { data: pageData } = await useAsyncData('about-page-data', () => fetchAboutPage('/about-us'))
usePageSeo(pageData.value?.seo, {
  title: pageData.value?.hero?.title ? `${pageData.value.hero.title} — Về chúng tôi` : 'Giới thiệu về chúng tôi',
  description: pageData.value?.hero?.description,
  pagePath: '/about',
  schemaType: 'AboutPage'
})
</script>

<template>
  <main v-if="pageData">
    <HeroSection v-bind="pageData.hero" :hashtags="pageData.hashtags" />
    <CompanyInfoSection v-bind="pageData.company" />
    <MetricsSection :metrics="pageData.metrics" :bg-color="pageData.metricsBgColor" />
    <TimelineSection v-bind="pageData.timeline" />

    <VisionMissionSection v-bind="pageData.visionMission" />
    <CoreValuesSection v-bind="pageData.coreValues" />
    <BrandPhilosophySection v-bind="pageData.philosophy" />
    <PreFooterCtaSection v-bind="pageData.preFooterCta" />
  </main>
</template>
