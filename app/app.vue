<script setup lang="ts">
const { query } = useWpApi()
const { proxyUrl } = useMediaProxy()

const { data: siteMeta } = await useAsyncData('site-meta', () =>
  query<{ generalSettings: { title: string; description: string; siteIconUrl?: string } }>(`
    query GetSiteMeta { generalSettings { title description siteIconUrl } }
  `).catch(() => ({ generalSettings: { title: 'Teanis', description: '', siteIconUrl: '' } }))
)

const faviconUrl = computed(() => {
  const raw = siteMeta.value?.generalSettings?.siteIconUrl
  return raw ? proxyUrl(raw, '/favicon.ico') : '/favicon.ico'
})

useHead({
  link: [
    { rel: 'icon', href: () => faviconUrl.value }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
