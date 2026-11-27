<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { fetchAboutPage } = useAboutPage()
const { data: pageData } = await useAsyncData('about-page-data', () => fetchAboutPage('/'))
usePageSeo(pageData.value?.seo, {
  title: pageData.value?.hero?.title,
  description: pageData.value?.hero?.description,
  pagePath: '/'
})


const introDone = ref(false)
</script>

<template>
  <main v-if="pageData">
    <IntroOverlay @complete="introDone = true" />
    <HeroSection v-bind="pageData.hero" :hashtags="pageData.hashtags" :intro-done="introDone" />
    <CompanyInfoSection v-bind="pageData.company" />
    <MetricsSection :metrics="pageData.metrics" :bg-color="pageData.metricsBgColor" />
    <TimelineSection v-bind="pageData.timeline" />

    <VisionMissionSection v-bind="pageData.visionMission" />
    <CoreValuesSection v-bind="pageData.coreValues" />
    <BrandPhilosophySection v-bind="pageData.philosophy" />
    <PreFooterCtaSection v-bind="pageData.preFooterCta" />
  </main>
</template>
