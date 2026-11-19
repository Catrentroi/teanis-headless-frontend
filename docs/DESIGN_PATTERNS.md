# Design Patterns & Architecture Blueprints

Tài liệu này chứa các **khuôn mẫu chuẩn (Golden Blueprints)** cho toàn bộ mã nguồn của dự án Headless WordPress + Nuxt 4.
> **Dành cho AI Agent & Developer**: Mọi component, composable, hoặc script tạo mới/refactor BẮT BUỘC phải tuân thủ đúng cấu trúc và nguyên tắc được định nghĩa dưới đây.

---

## Pattern 1: Section Component Blueprint (`app/components/sections/`)

Mỗi Section là một Presentational Component thuần túy:
- **Chỉ nhận dữ liệu qua `defineProps<Props>()`**: Tuyệt đối KHÔNG gọi `useFetch`, `useAsyncData` bên trong section.
- **SSR-Safe GSAP**: Luôn bọc animation trong `gsap.context` và dọn dẹp bằng `ctx.revert()` trong `onUnmounted`.
- **Layout Container**: Row nội dung luôn tuân thủ chuẩn `max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0`.
- **Ponytail Principle**: Sử dụng `v-if` cho tất cả các field từ CMS, không hiển thị chuỗi giả/hardcode khi dữ liệu rỗng.

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  badge?: string
  title?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  bgColor?: string
  bgImage?: string
}

const props = defineProps<Props>()

// Root template ref for scoping GSAP animations
const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!sectionRef.value) return

  // Scope all GSAP animations strictly to this component's DOM
  ctx = gsap.context(() => {
    gsap.from('.animate-item', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  // Prevent memory leaks & animation conflicts during Nuxt page transitions
  ctx?.revert()
})
</script>
<template>
  <section
    ref="sectionRef"
    class="relative overflow-hidden py-16 lg:py-24"
    :style="{
      backgroundColor: bgColor,
      backgroundImage: bgImage ? `url(${bgImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <!-- Content container standard -->
    <div class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 w-full">
      <div v-if="badge" class="animate-item mb-4">
        <span class="inline-flex px-3.5 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-teal-900">
          {{ badge }}
        </span>
      </div>

      <h2 v-if="title" class="animate-item text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        {{ title }}
      </h2>

      <p v-if="description" class="animate-item text-base sm:text-lg text-gray-600 max-w-2xl mb-8">
        {{ description }}
      </p>

      <div v-if="ctaText && ctaLink" class="animate-item">
        <NuxtLink
          :to="ctaLink"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0709a2] text-white font-medium hover:opacity-90 transition-opacity"
        >
          <span>{{ ctaText }}</span>
          <span aria-hidden="true">&nearr;</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
```

---

## Pattern 2: Single-Line Data Binding & Composable (`app/pages/` & `app/composables/`)

### 2.1. Template Data Binding 1 Dòng Lệnh (`v-bind`)
Tại Smart Page (`app/pages/index.vue`), tuyệt đối KHÔNG khai báo prop rời rạc thủ công từng dòng. Luôn truyền data bằng cú pháp `v-bind="pageData.sectionName"`:
```vue
<template>
  <main v-if="pageData">
    <!-- Mỗi section chỉ đúng 1 dòng lệnh, tự động unpack toàn bộ props -->
    <HeroSection v-bind="pageData.hero" :hashtags="pageData.hashtags" />
    <CompanyInfoSection v-bind="pageData.company" />
    <TimelineSection v-bind="pageData.timeline" />
  </main>
</template>
```

### 2.2. WPGraphQL Auto-Cleaner (`app/utils/wpClean.ts`)
Không map thủ công từng field media hay repeater. Dùng `cleanAcfData(raw)` để tự động giải nén `{ node: { sourceUrl } }` sang proxy URL:
```typescript
import { cleanAcfData } from '~/utils/wpClean'

export const useAboutPage = () => {
  const { query } = useWpApi()
  // Fetch query GraphQL...
  const f = cleanAcfData(res.page.aboutPageFields)
  return {
    hero: { ...f.hero, illustration: f.heroIllustration },
    company: { ...f.company, companyName: f.companyName }
  }
}
```

### 2.3. Single-Line SEO & Schema (`app/composables/usePageSeo.ts`)
Mọi trang (Page) không tự viết lặp lại các computed SEO, Canonical, OpenGraph hay Schema JSON-LD. Luôn gọi duy nhất 1 câu lệnh `usePageSeo`:
```typescript
usePageSeo(pageData.value?.seo, {
  title: pageData.value?.hero?.title,
  description: pageData.value?.hero?.description,
  pagePath: '/about',
  schemaType: 'AboutPage'
})
```

### 2.4. Zero-CORS GraphQL Proxy (`server/api/graphql.post.ts`)
Để triệt tiêu 100% lỗi CORS trên trình duyệt khi deploy Nuxt (Vercel) + WordPress (Pantheon):
- `useWpApi()` tự động phân biệt:
  - **Browser (Client-side)**: Gọi proxy nội bộ `/api/graphql` cùng domain frontend.
  - **Server (SSR / ISR)**: Gọi trực tiếp tới WordPress CMS server-to-server.
- Không bao giờ để trình duyệt gọi trực tiếp sang domain khác ngoài domain frontend.


---

## Pattern 3: ACF JSON Sync Script Blueprint (Node.js)

Để bảo toàn ký tự tiếng Việt (tránh lỗi font Mojibake trên Windows do PowerShell ép về Windows-1252), mọi chỉnh sửa ACF JSON phải sử dụng script Node.js với `utf8` rõ ràng:

```javascript
// scripts/update-acf-field.js
import fs from 'node:fs'
import http from 'node:http'

const SOURCE_PATH = 'd:/wordpress/headless/acf-about-page.json'
const SYNC_WEBHOOK = 'http://headless-landing.local/?sync_acf=secret123'

// 1. Đọc và chỉnh sửa JSON với UTF-8 không BOM
const raw = fs.readFileSync(SOURCE_PATH, 'utf8')
const schema = JSON.parse(raw)

// Thay đổi field...
fs.writeFileSync(SOURCE_PATH, JSON.stringify(schema, null, 2), 'utf8')

// 2. Kích hoạt sync vào WordPress database
http.get(SYNC_WEBHOOK, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => console.log('Sync result:', data))
})
```

---

## 4. Checklist Kiểm Định Trước Khi Hoàn Thành Code (Verification Checklist)

Mỗi khi AI hoàn thành hoặc refactor một Section Component:
- [ ] Section có nhận dữ liệu qua `defineProps<Props>()` không?
- [ ] Có bất kỳ lệnh gọi API trực tiếp (`useFetch`, `useAsyncData`) nào trong Section không? *(Phải bằng 0)*.
- [ ] Animation GSAP đã được bọc trong `gsap.context(..., sectionRef.value)` chưa?
- [ ] Có gọi `ctx?.revert()` trong hook `onUnmounted()` chưa?
- [ ] Row nội dung có class container chuẩn `max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0` chưa?
- [ ] Smart Page truyền dữ liệu xuống Section bằng cú pháp gọn `v-bind="pageData.sectionName"` chưa?
- [ ] Toàn bộ các props hiển thị từ CMS đã được bọc `v-if` chưa?
- [ ] Đã tuân thủ giới hạn <= 80 dòng code trên mỗi lượt sửa đổi chưa?
