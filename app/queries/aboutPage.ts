export const ABOUT_PAGE_QUERY = `
  query GetAboutPage($id: ID!) {
    page(id: $id, idType: URI) {
      title
      aboutPageFields {
        heroBgColor heroBgImage { node { sourceUrl } } heroBadge heroTitle heroDescription heroCtaText heroCtaLink heroIllustration { node { sourceUrl } }
        hashtagItems { text }
        companyBgColor companyBgImage { node { sourceUrl } } companySubtitle companyTitle companyPhonetic companyAudioFile { node { mediaItemUrl sourceUrl } }
        companyName companyDescription companyPillarsTitle companyPillars { title icon { node { sourceUrl } } } companyCommitmentsTitle companyCommitments { text }
        companyProfileNote companyYearsExp companyExpLabel companyVideoPoster { node { sourceUrl } } companyVideoUrl companyCtaText companyCtaLink
        metricsBgColor metricsList { value label sublabel }
        timelineBgColor timelineSubtitle timelineTitle timelineDescription timelineItems { year title desc icon { node { sourceUrl } } }
        vmBgColor vmSubtitle vmTitle vmDescription visionTitle visionText visionIcon { node { sourceUrl } } missionTitle missionItems { text } missionIcon { node { sourceUrl } }
        valuesBgColor valuesSubtitle valuesTitle valuesItems { symbol title desc }
        philBgColor philSubtitle philTitle philIntro philBrandLogo { node { sourceUrl } } philStoryText philSymbolTitle philSymbolDesc philSymbolVideo { node { mediaItemUrl sourceUrl } } philSymbolIcon { node { sourceUrl } } philClosingText
        ctaBgColor ctaHeading ctaSubheading ctaButtonText ctaButtonLink ctaIllustration { node { sourceUrl } }
      }
      seo { title metaDesc opengraphTitle opengraphDescription opengraphImage { sourceUrl } canonical schema { raw } }
    }
  }
`
