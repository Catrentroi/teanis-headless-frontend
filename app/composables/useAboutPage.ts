export interface AboutPageData {
  hero?: {
    badge?: string
    title?: string
    description?: string
    ctaText?: string
    ctaLink?: string
    illustration?: string
    bgColor?: string
    bgImage?: string
  }
  hashtags?: string[]
  company?: {
    subtitle?: string
    title?: string
    phonetic?: string
    audioUrl?: string
    name?: string
    description?: string
    pillarsTitle?: string
    pillars?: Array<{ title: string; icon?: string }>
    commitmentsTitle?: string
    commitments?: string[]
    profileNote?: string
    yearsExp?: number
    expLabel?: string
    videoPoster?: string
    videoUrl?: string
    ctaText?: string
    ctaLink?: string
    bgColor?: string
    bgImage?: string
  }
  metrics?: Array<{ value: string; label: string; sublabel?: string }>
  metricsBgColor?: string
  timeline?: {
    subtitle?: string
    title?: string
    description?: string
    items?: Array<{ year: string; title: string; desc: string; icon?: string }>
    bgColor?: string
  }
  visionMission?: {
    subtitle?: string
    title?: string
    description?: string
    visionTitle?: string
    visionText?: string
    visionIcon?: string
    missionTitle?: string
    missionItems?: string[]
    missionIcon?: string
    bgColor?: string
  }
  coreValues?: {
    subtitle?: string
    title?: string
    values?: Array<{ symbol?: string; title: string; desc: string }>
    bgColor?: string
  }
  philosophy?: {
    subtitle?: string
    title?: string
    intro?: string
    brandLogo?: string
    storyText?: string
    symbolTitle?: string
    symbolDesc?: string
    symbolIcon?: string
    closingText?: string
    bgColor?: string
  }
  preFooterCta?: {
    illustration?: string
    heading?: string
    subheading?: string
    buttonText?: string
    buttonLink?: string
    bgColor?: string
  }
  seo?: {
    title?: string
    metaDesc?: string
    opengraphTitle?: string
    opengraphDescription?: string
    opengraphImage?: string
    canonical?: string
    schemaRaw?: string
  }
}

function resolveMediaUrl(url?: string, defaultFallback: string = ''): string {
  if (!url) return defaultFallback
  const lower = url.toLowerCase()
  if (lower.includes('kien-tao')) return '/images/company/kien-tao.svg'
  if (lower.includes('hieu-qua')) return '/images/company/hieu-qua.webp'
  if (lower.includes('dong-hanh')) return '/images/company/dong-hanh.svg'
  if (lower.includes('illustation')) return '/images/illustation.svg'
  if (lower.includes('teanis_horizontal') || lower.includes('cropped-teanis')) return '/images/Teanis_horizontal.svg'
  if (lower.includes('sound') || lower.includes('.mp3')) return '/audio/sound.mp3'
  if (lower.includes('1-shape')) return '/images/company/1-shape.webp'
  if (lower.includes('card-bg-shape')) return '/images/company/card-bg-shape.webp'
  if (lower.includes('card-border-frame')) return '/images/company/card-border-frame.webp'
  if (lower.includes('video-poster')) return '/images/company/video-poster.webp'
  if (lower.includes('teanis-brand-logo') || lower.includes('group.svg')) return '/images/philosophy/teanis-brand-logo.svg'
  if (lower.includes('monogram-symbol')) return '/images/philosophy/monogram-symbol.svg'
  if (lower.includes('vision-eye') || lower.includes('vision')) return '/images/values/vision-eye.svg'
  if (lower.includes('mission-target') || lower.includes('mission')) return '/images/values/mission-target.svg'
  if (lower.includes('rectangle-8')) return '/images/screenshot.webp'
  return url
}

export const useAboutPage = () => {
  const { query } = useWpApi()

  const fetchAboutPage = async (uri: string = '/'): Promise<AboutPageData> => {
    const pageQuery = `
      query GetAboutPage($id: ID!) {
        page(id: $id, idType: URI) {
          title
          aboutPageFields {
            heroBgColor
            heroBgImage { node { sourceUrl } }
            heroBadge
            heroTitle
            heroDescription
            heroCtaText
            heroCtaLink
            heroIllustration { node { sourceUrl } }
            hashtagItems { text }
            companyBgColor
            companyBgImage { node { sourceUrl } }
            companySubtitle
            companyTitle
            companyPhonetic
            companyAudioFile { node { mediaItemUrl sourceUrl } }
            companyName
            companyDescription
            companyPillarsTitle
            companyPillars { title icon { node { sourceUrl } } }
            companyCommitmentsTitle
            companyCommitments { text }
            companyProfileNote
            companyYearsExp
            companyExpLabel
            companyVideoPoster { node { sourceUrl } }
            companyVideoUrl
            companyCtaText
            companyCtaLink
            metricsBgColor
            metricsList { value label sublabel }
            timelineBgColor
            timelineSubtitle
            timelineTitle
            timelineDescription
            timelineItems { year title desc icon { node { sourceUrl } } }
            vmBgColor
            vmSubtitle
            vmTitle
            vmDescription
            visionTitle
            visionText
            visionIcon { node { sourceUrl } }
            missionTitle
            missionItems { text }
            missionIcon { node { sourceUrl } }
            valuesBgColor
            valuesSubtitle
            valuesTitle
            valuesItems { symbol title desc }
            philBgColor
            philSubtitle
            philTitle
            philIntro
            philBrandLogo { node { sourceUrl } }
            philStoryText
            philSymbolTitle
            philSymbolDesc
            philSymbolIcon { node { sourceUrl } }
            philClosingText
            ctaBgColor
            ctaHeading
            ctaSubheading
            ctaButtonText
            ctaButtonLink
            ctaIllustration { node { sourceUrl } }
          }
          seo {
            title
            metaDesc
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
            }
            canonical
            schema {
              raw
            }
          }
        }
      }
    `

    let res = await query<{ page?: { title?: string; aboutPageFields?: any; seo?: any } }>(pageQuery, { id: uri })
    if (!res?.page?.aboutPageFields && uri !== '/') {
      res = await query<{ page?: { title?: string; aboutPageFields?: any; seo?: any } }>(pageQuery, { id: '/' })
    }

    const f = res?.page?.aboutPageFields
    const s = res?.page?.seo
    if (!f) return {}

    return {
      hero: {
        badge: f.heroBadge || '',
        title: f.heroTitle || '',
        description: f.heroDescription || '',
        ctaText: f.heroCtaText || '',
        ctaLink: f.heroCtaLink || '',
        illustration: resolveMediaUrl(f.heroIllustration?.node?.sourceUrl, '/images/illustation.svg'),
        bgColor: f.heroBgColor || '',
        bgImage: resolveMediaUrl(f.heroBgImage?.node?.sourceUrl)
      },
      hashtags: f.hashtagItems?.map((item: any) => item.text).filter(Boolean) || [],
      company: {
        subtitle: f.companySubtitle || '',
        title: f.companyTitle || '',
        phonetic: f.companyPhonetic || '',
        audioUrl: resolveMediaUrl(f.companyAudioFile?.node?.mediaItemUrl || f.companyAudioFile?.node?.sourceUrl, '/audio/sound.mp3'),
        name: f.companyName || '',
        description: f.companyDescription || '',
        pillarsTitle: f.companyPillarsTitle || '',
        pillars: f.companyPillars?.map((p: any, idx: number) => ({
          title: p.title,
          icon: resolveMediaUrl(p.icon?.node?.sourceUrl, idx === 0 ? '/images/company/kien-tao.svg' : idx === 1 ? '/images/company/hieu-qua.webp' : '/images/company/dong-hanh.svg')
        })) || [],
        commitmentsTitle: f.companyCommitmentsTitle || '',
        commitments: f.companyCommitments?.map((c: any) => c.text).filter(Boolean) || [],
        profileNote: f.companyProfileNote || '',
        yearsExp: f.companyYearsExp ?? undefined,
        expLabel: f.companyExpLabel || '',
        videoPoster: resolveMediaUrl(f.companyVideoPoster?.node?.sourceUrl, '/images/company/video-poster.webp'),
        videoUrl: f.companyVideoUrl || '',
        ctaText: f.companyCtaText || '',
        ctaLink: f.companyCtaLink || '',
        bgColor: f.companyBgColor || '',
        bgImage: resolveMediaUrl(f.companyBgImage?.node?.sourceUrl)
      },
      metrics: f.metricsList || [],
      metricsBgColor: f.metricsBgColor || '',
      timeline: {
        subtitle: f.timelineSubtitle || '',
        title: f.timelineTitle || '',
        description: f.timelineDescription || '',
        items: f.timelineItems?.map((t: any) => ({
          year: t.year,
          title: t.title,
          desc: t.desc,
          icon: resolveMediaUrl(t.icon?.node?.sourceUrl)
        })) || [],
        bgColor: f.timelineBgColor || ''
      },
      visionMission: {
        subtitle: f.vmSubtitle || '',
        title: f.vmTitle || '',
        description: f.vmDescription || '',
        visionTitle: f.visionTitle || '',
        visionText: f.visionText || '',
        visionIcon: resolveMediaUrl(f.visionIcon?.node?.sourceUrl, '/images/values/vision-eye.svg'),
        missionTitle: f.missionTitle || '',
        missionItems: f.missionItems?.map((m: any) => m.text).filter(Boolean) || [],
        missionIcon: resolveMediaUrl(f.missionIcon?.node?.sourceUrl, '/images/values/mission-target.svg'),
        bgColor: f.vmBgColor || ''
      },
      coreValues: {
        subtitle: f.valuesSubtitle || '',
        title: f.valuesTitle || '',
        values: f.valuesItems || [],
        bgColor: f.valuesBgColor || ''
      },
      philosophy: {
        subtitle: f.philSubtitle || '',
        title: f.philTitle || '',
        intro: f.philIntro || '',
        brandLogo: resolveMediaUrl(f.philBrandLogo?.node?.sourceUrl, '/images/philosophy/teanis-brand-logo.svg'),
        storyText: f.philStoryText || '',
        symbolTitle: f.philSymbolTitle || '',
        symbolDesc: f.philSymbolDesc || '',
        symbolIcon: resolveMediaUrl(f.philSymbolIcon?.node?.sourceUrl, '/images/philosophy/monogram-symbol.svg'),
        closingText: f.philClosingText || '',
        bgColor: f.philBgColor || ''
      },
      preFooterCta: {
        illustration: resolveMediaUrl(f.ctaIllustration?.node?.sourceUrl, '/images/illustation.svg'),
        heading: f.ctaHeading || '',
        subheading: f.ctaSubheading || '',
        buttonText: f.ctaButtonText || '',
        buttonLink: f.ctaButtonLink || '',
        bgColor: f.ctaBgColor || ''
      },
      seo: {
        title: s?.title || '',
        metaDesc: s?.metaDesc || '',
        opengraphTitle: s?.opengraphTitle || '',
        opengraphDescription: s?.opengraphDescription || '',
        opengraphImage: s?.opengraphImage?.sourceUrl || '',
        canonical: s?.canonical || '',
        schemaRaw: s?.schema?.raw || ''
      }
    }
  }

  return { fetchAboutPage }
}
