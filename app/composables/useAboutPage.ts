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
    companyName?: string
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
    symbolVideo?: string
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

import { cleanAcfData } from '../utils/wpClean'

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
            philSymbolVideo { node { mediaItemUrl sourceUrl } }
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

    const raw = res?.page?.aboutPageFields
    const s = res?.page?.seo
    if (!raw) return {}
    const f = cleanAcfData(raw)

    return {
      hero: {
        badge: f.heroBadge || '',
        title: f.heroTitle || '',
        description: f.heroDescription || '',
        ctaText: f.heroCtaText || '',
        ctaLink: f.heroCtaLink || '',
        illustration: f.heroIllustration || '/images/illustation.svg',
        bgColor: f.heroBgColor || '',
        bgImage: f.heroBgImage || ''
      },
      hashtags: Array.isArray(f.hashtagItems) ? f.hashtagItems : [],
      company: {
        subtitle: f.companySubtitle || '',
        title: f.companyTitle || '',
        phonetic: f.companyPhonetic || '',
        audioUrl: f.companyAudioFile || '/audio/sound.mp3',
        name: f.companyName || '',
        companyName: f.companyName || '',
        description: f.companyDescription || '',
        pillarsTitle: f.companyPillarsTitle || '',
        pillars: f.companyPillars || [],
        commitmentsTitle: f.companyCommitmentsTitle || '',
        commitments: Array.isArray(f.companyCommitments) ? f.companyCommitments : [],
        profileNote: f.companyProfileNote || '',
        yearsExp: f.companyYearsExp ?? undefined,
        expLabel: f.companyExpLabel || '',
        videoPoster: f.companyVideoPoster || '/images/company/video-poster.webp',
        videoUrl: f.companyVideoUrl || '',
        ctaText: f.companyCtaText || '',
        ctaLink: f.companyCtaLink || '',
        bgColor: f.companyBgColor || '',
        bgImage: f.companyBgImage || ''
      },
      metrics: f.metricsList || [],
      metricsBgColor: f.metricsBgColor || '',
      timeline: {
        subtitle: f.timelineSubtitle || '',
        title: f.timelineTitle || '',
        description: f.timelineDescription || '',
        items: f.timelineItems || [],
        bgColor: f.timelineBgColor || ''
      },
      visionMission: {
        subtitle: f.vmSubtitle || '',
        title: f.vmTitle || '',
        description: f.vmDescription || '',
        visionTitle: f.visionTitle || '',
        visionText: f.visionText || '',
        visionIcon: f.visionIcon || '/images/values/vision-eye.svg',
        missionTitle: f.missionTitle || '',
        missionItems: Array.isArray(f.missionItems) ? f.missionItems : [],
        missionIcon: f.missionIcon || '/images/values/mission-target.svg',
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
        brandLogo: f.philBrandLogo || '/images/philosophy/teanis-brand-logo.svg',
        storyText: f.philStoryText || '',
        symbolTitle: f.philSymbolTitle || '',
        symbolDesc: f.philSymbolDesc || '',
        symbolVideo: f.philSymbolVideo || '',
        symbolIcon: f.philSymbolIcon || '/images/philosophy/monogram-symbol.svg',
        closingText: f.philClosingText || '',
        bgColor: f.philBgColor || ''
      },
      preFooterCta: {
        illustration: f.ctaIllustration || '/images/footer/cta-frame.svg',
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
