# Project Context & Architecture Documentation

Tài liệu này lưu trữ toàn bộ kiến trúc, cấu hình môi trường, quy tắc dữ liệu và hướng dẫn bảo trì cho dự án **Headless WordPress + Nuxt 4 Landing Page (Teanis)**.
> **Dành cho Developer và AI Agent**: Hãy đọc tài liệu này trước khi thực hiện bất kỳ thay đổi nào để đảm bảo tính nhất quán và không gặp lỗi mã hóa (mojibake) hay lệch schema.

---

## 1. Thông Tin Tổng Quan & Tech Stack

- **Frontend**: [Nuxt 4](https://nuxt.com/) (Vue 3, Vite, Tailwind CSS v4, `@nuxt/image`, `@nuxt/icon`).
  - Thư mục làm việc: `d:\wordpress\headless\landing-nuxt`
  - Chạy dev: `npm run dev` (mặc định tại `http://localhost:3000`)
  - Build: `npm run build`
- **Backend / CMS**: WordPress Local (Local by Flywheel) & Pantheon.io Cloud
  - Môi trường Local: `http://headless-landing.local` (WPGraphQL: `http://headless-landing.local/graphql`)
  - Môi trường Production (Đã chọn): **[Pantheon.io](https://pantheon.io/) (Sandbox 0đ vĩnh viễn)**
    - URL dự kiến: `https://dev-teanis-cms.pantheonsite.io` (WPGraphQL: `https://dev-teanis-cms.pantheonsite.io/graphql`)
    - Ưu điểm: Miễn phí trọn đời, hỗ trợ Git/SFTP, bảo mật cao, không yêu cầu thẻ tín dụng, hoạt động 24/7 độc lập.
  - Thư mục cài đặt WP Local: `C:\Users\Admin\Local Sites\headless-landing\app\public`
  - Theme đang kích hoạt: `twentytwentyfive`
  - Plugins cốt lõi: **WPGraphQL**, **Advanced Custom Fields Pro (ACF)**, **WPGraphQL for ACF**, **WordPress SEO (Yoast)**, **Add WPGraphQL SEO**.
- **Frontend Production**: **[Vercel](https://vercel.com/)** (Miễn phí gói Hobby, CI/CD tự động từ GitHub, gắn domain chính `https://teanis.com`).
- **Figma Design Reference**:
  - File Key: `Jxs4aII2hgoKk0DYddd3In`
  - Màn hình chính: **About Us** (`node-id=1:659`)
  - Chiều rộng chuẩn của content container: `max-w-[1400px]`

---

## 2. Quy Tắc Cốt Lõi Về ACF & Đồng Bộ WordPress (QUAN TRỌNG)

### 2.1. Cảnh báo mã hóa tiếng Việt (Mojibake Windows-1252)
> [!CAUTION]
> **Tuyệt đối KHÔNG** dùng PowerShell `Get-Content`/`Set-Content` mặc định để đọc/ghi file ACF JSON mà không chỉ định rõ UTF-8, vì PowerShell trên Windows sẽ ép về mã hóa Windows-1252 gây lỗi font tiếng Việt trong WP-Admin (`Tháº¥ng tin cáº£ng ty`, `MÃ u ná» n`).
> - Luôn thao tác file JSON bằng script **Node.js** với encoding `'utf8'` rõ ràng và **không có BOM**.

### 2.2. Vị trí file cấu hình ACF
- File nguồn chính: `d:\wordpress\headless\acf-about-page.json`
- File sync của WordPress: `C:\Users\Admin\Local Sites\headless-landing\app\public\wp-content\mu-plugins\acf-json\group_about_page_fields.json`

### 2.3. Cơ chế kích hoạt Sync ACF vào Database
Trong `wp-content/mu-plugins/headless-config.php`, có một webhook hỗ trợ import trực tiếp JSON vào database:
- Kích hoạt sync: Gọi HTTP GET tới `http://headless-landing.local/?sync_acf=secret123`
- Kết quả mong đợi: `{"success": true, "fields_count": 78, "key": "group_about_page_fields"}`

### 2.4. Mapping URL Trang (Home vs About Us)
- Trong Figma là trang **"About Us"**, nhưng trên WordPress người dùng có thể cấu hình trang này làm **Trang chủ (`home` - slug `/`)**.
- Composable `useAboutPage.ts` đã được thiết lập để query trang theo URI `uri`, và nếu trang đó chưa có dữ liệu sẽ tự động fallback truy vấn trang `/` (Home), đảm bảo hiển thị đúng dù trang được gán là Home hay About.

---

## 3. Kiến Trúc Các Section & Cấu Trúc Dữ Liệu

Landing page bao gồm 9 section chính được chia thành các component độc lập tại `app/components/sections/`:

### 00. Header (`TheHeader.vue` - Figma `1:2480`)
- Header dạng **Card nổi cố định (Floating Sticky)**, nằm trong container `max-w-[1400px]`, `rounded-[16px]`, bóng đổ nhẹ `shadow-[0_4px_30px_rgba(0,0,0,0.06)]`.
- Nút CTA `#0709a2` ("Get in touch ↗").
- Có mobile drawer cho kích thước màn hình nhỏ.

### 01. Hero Banner (`HeroSection.vue` - Figma `1:2470`)
- Content row `max-w-[1400px]`.
- Tiêu đề 2 dòng: "SHAPE UP" (màu đen `#141414`), "FOR" (màu đen), chữ **"GROWTH"** nổi bật với màu trắng (`text-white`).
- Tranh minh họa vector tại `public/images/illustation.svg`.
- **Dải Hashtag Marquee (`1:2697`)**: Được tích hợp trực tiếp vào phần đáy của `HeroSection` dưới dạng một row tràn full-width (background xanh mint nhạt, các pill hashtag bo cong màu `#baf8f3`).

### 03. Thông Tin Công Ty (`CompanyInfoSection.vue` - Figma `1:664`)
- **Cột trái**:
  - Tiêu đề thương hiệu: `Teanis Technologies` (chữ Teanis màu `#00d1bc`).
  - Nút phát âm: Audio icon bấm để nghe phát âm `"ti-a-nis"`.
  - Giới thiệu chung và 3 trụ cột cốt lõi: *Kiến tạo*, *Hiệu quả*, *Đồng hành*.
  - **Trường văn bản riêng biệt**: `company_pillars_title` và `company_commitments_title` (được cấu hình dạng Text độc lập trong ACF để tránh bị biến thành bullet list).
  - Ghi chú tải profile `company_profile_note` bên cạnh nút "View Profile ↗".
- **Cột phải (Card Video 10+ Năm Kinh Nghiệm - Figma `1:772`)**:
  - **Các layer đồ họa được cố định bằng code**:
    - Nền bo góc nghiêng màu ngọc bích (`card-bg-shape.png`).
    - Khung viền viền ngoài màu cyan (`card-border-frame.png`).
    - Huy hiệu **"10+ YEAR OF EXPERIENCE"** (Figma `1:781`, tọa độ theo khung video `1:779` 627×431): `exp-1.svg`, `exp-ring.svg`, `exp-ring-inner.svg` (cyan), `exp-plus.svg` — đặt **absolute %** (không flex center); chữ `YEAR OF` / `EXPERIENCE` canh trái, `font-size` scale bằng `cqh` (xem `.experience-badge` trong `CompanyInfoSection.vue`).
    - Nút tròn Play video màu trắng góc dưới bên trái (`play-icon.png`).
  - **Trong WordPress CMS**: Người dùng chỉ cần nhập:
    - `Ảnh bìa video` (`company_video_poster`)
    - `Đường dẫn video` (`company_video_url` - YouTube hoặc link video mp4).

### 04. Con Số Nổi Bật (`MetricsSection.vue` - Figma `1:805`)
- Nền xám nhạt `#F0F0F0`, các con số lớn màu đen `#141414` (30+ Nhân sự, 12+ Dịch vụ, 20+ Khách hàng, 35+ Dự án).

### 05. Cột Mốc Timeline (`TimelineSection.vue` - Figma `1:825`)
- Trục thời gian trực quan nối các mốc năm (2018, 2019, 2020, 2024) kèm icon và mô tả.

### 06. Tầm Nhìn & Sứ Mệnh (`VisionMissionSection.vue` - Figma `1:836`)
- 2 thẻ đối xứng cho Tầm nhìn (Vision) và Sứ mệnh (Mission) kèm biểu tượng và các gạch đầu dòng sứ mệnh.

### 07. Giá Trị Cốt Lõi S-F-P-B (`CoreValuesSection.vue` - Figma `1:861`)
- Ma trận 4 ô giá trị cốt lõi:
  - **S**peed (Tốc độ)
  - **F**lexibility (Linh hoạt)
  - **P**rofessionalism (Chuyên nghiệp)
  - **B**reakthrough (Bứt phá)

### 08. 4 Nguyên Tắc & Triết Lý Thương Hiệu (`BrandPhilosophySection.vue` - Figma `1:916`)
- 4 yếu tố tự nhiên: **TERRA**, **AQUA**, **IGNIS**, **VENTUS**.
- Phân tích cấu trúc logo Teanis và các câu chuyện triết lý thương hiệu.

### 09. Pre-Footer CTA (`PreFooterCtaSection.vue` - Figma `1:1017`)
- Slogan "SHAPE UP FOR GROWTH", tranh minh họa đội ngũ làm việc và box liên hệ "Let's Talk About Business Solutions With Us".

### 10. Footer (`TheFooter.vue` - Figma `1:1250`)
- Nền xanh đậm thương hiệu `#0709a2`, logo trắng, các cột liên kết, mạng xã hội và thông tin bản quyền.

---

## 4. Cấu Trúc Thư Mục Frontend

```
landing-nuxt/
├── app/
│   ├── assets/css/
│   │   └── figma-tokens.css           # Ghi chú token typography (import trong nuxt.config)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TheHeader.vue          # Sticky floating header card
│   │   │   └── TheFooter.vue          # Navy footer
│   │   └── sections/
│   │       ├── HeroSection.vue        # Hero banner + hashtag marquee
│   │       ├── CompanyInfoSection.vue # Company info + fixed 10+ exp card
│   │       ├── MetricsSection.vue     # 4 stats metrics
│   │       ├── TimelineSection.vue    # History milestones
│   │       ├── VisionMissionSection.vue
│   │       ├── CoreValuesSection.vue  # S-F-P-B cards
│   │       ├── BrandPhilosophySection.vue
│   │       └── PreFooterCtaSection.vue
│   ├── composables/
│   │   └── useAboutPage.ts            # WPGraphQL query & data transformer
│   ├── layouts/
│   │   └── default.vue
│   └── pages/
│       ├── index.vue                  # Trang chủ (kết nối props từ GraphQL)
│       └── about.vue                  # Trang About Us
├── docs/
│   └── PROJECT_CONTEXT.md             # File tài liệu này
├── public/
│   └── images/
│       ├── illustation.svg            # Hero illustration
│       ├── Teanis_horizontal.svg      # Logo
│       └── company/                   # Toàn bộ vector & layer trang trí section 03
├── acf-about-page.json                # Schema ACF Pro 78 fields (UTF-8 no BOM)
└── nuxt.config.ts                     # Cấu hình Nuxt 4 + Tailwind
```

---

## 5. Nguyên Tắc Phát Triển Tiếp Theo (Developer / AI Guidelines)

1. **Ponytail Principle (Tối giản & Đúng yêu cầu)**:
   - Không tự động bịa thêm text giả hoặc hardcode dữ liệu tĩnh vào giao diện khi backend chưa có dữ liệu. Sử dụng `v-if` cho các trường dữ liệu tùy biến.
2. **Kích thước Container**:
   - Mọi row nội dung bên trong các section đều phải căn giữa với `max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0`.
2b. **Typography Figma (Design System)**:
   - Dùng class Tailwind `text-ds-*` trong `tailwind.config.ts`: `ds-16` (16/24), `ds-18` (18/27), `ds-20` (20/30), `ds-24` (24/36), `ds-36` (36/54), `ds-48` (48/72), `ds-82` (82 / lh 1.5). Font: **Lexend** toàn site.
3. **Màu nền Section**:
   - Hầu hết các section đều hỗ trợ prop `:bg-color` và `:bg-image` từ WordPress để khách hàng có thể đổi màu/ảnh nền trong CMS mà không cần sửa code.
4. **Khi thêm/sửa trường ACF**:
   - Cập nhật cả `acf-about-page.json` và sync sang Local WP bằng Node.js script.
   - Thêm trường tương ứng vào câu query GraphQL trong `app/composables/useAboutPage.ts`.
   - Bind prop vào `app/pages/index.vue` và component tương ứng.

---

## 6. Nhật Ký Công Việc (Recent Work Log)

### Phiên làm việc: 12/11/2026
- **Header & Hero**:
  - Chuyển TheHeader thành card nổi cố định (`fixed top-0`, `max-w-[1400px]`, `rounded-[16px]`).
  - HeroSection: Tách màu chữ "GROWTH" thành màu trắng, tích hợp dải hashtag marquee thành row full-width ở đáy hero.
- **Section 03 (Company Info)**:
  - Cố định toàn bộ các layer đồ họa của card video 10+ năm kinh nghiệm (`exp-1.svg`, `exp-ring.svg`, `card-bg-shape.png`, `card-border-frame.png`, nút Play).
  - Phía WordPress chỉ cần nhập: `company_video_poster` và `company_video_url`.
  - Thêm trường text độc lập: `company_pillars_title`, `company_commitments_title`, `company_profile_note` để text giới thiệu không bị biến thành bullet list.
- **WordPress & ACF Fixes**:
  - Khắc phục triệt để lỗi mã hóa font tiếng Việt (mojibake) bằng cách chuẩn hóa JSON UTF-8 không BOM.
  - Đồng bộ thành công 78 trường ACF vào Local WP qua webhook `?sync_acf=secret123`.
- **Font & Typography**:
  - Chuẩn hóa toàn bộ dự án sử dụng duy nhất font **Lexend** (`fontFamily.sans: ['Lexend', 'sans-serif']`).
- **Section 06 & 07 (Tầm nhìn - Sứ mệnh & Giá trị cốt lõi)**:
  - Cập nhật `VisionMissionSection.vue`: 2 card Tầm nhìn & Sứ mệnh bo tròn 20px với watermark icon mắt và mục tiêu, nền `#F0F0F0`.
  - Cập nhật `CoreValuesSection.vue`: Vòng tròn xoay mũi tên ở giữa (`circle-arrows.png`) cùng 4 card nghiêng cố định S, F, P, B (`card-s.png`, `card-f.png`, `card-p.png`, `card-b.png`), nội dung text overlay từ backend WPGraphQL.
- **Section 05 (Lịch sử hình thành / Timeline)**:
  - Xây dựng `TimelineSection.vue` từ Figma node `1:825` với 4 mốc thời gian (2015, 2019, 2023, 2024), đường runway ngang, gắn sẵn semantic class sẵn sàng cho animation GSAP.
- **Section 08 (Câu chuyện thương hiệu / Brand Philosophy)**:
  - Chuẩn hóa tiêu đề chính/phụ, nâng cấp `phil_story_text` thành WYSIWYG editor trên CMS (tự do bôi đậm, tự sinh thẻ `<p>` cách nhau `1.25rem`, không render rác `<br/>`).
  - Lắp đặt toàn bộ hệ thống background theo thứ tự Figma: `Frame1.svg` (luminosity wave đỉnh trang) -> `Vector.svg` (sóng giữa) -> `Union.svg` (4 cụm khối quanh Monogram) -> `Frame.svg` (cột rounded rects đáy) kết hợp gradient `#83f3e9`.
  - Chuyển 4 thẻ nguyên tố (TERRA, AQUA, IGNIS, VENTUS) về local với Inline SVG và tích hợp hiệu ứng GSAP hover độc bản (khối nổi địa tầng, sóng nước dập dềnh, ngọn lửa bập bùng rực sáng, gió lướt bay bổng).
  - Tối ưu backend ACF: Xóa repeater `phil_element_images` thừa, tự động dọn sạch các bản ghi trùng lặp qua webhook sync.

### Phiên làm việc: 16/11/2026

#### Công cụ & quy trình (Ponytail)
- Cài upstream **[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)**: clone `C:\Users\Admin\ponytail`, hooks tại `landing-nuxt\.cursor\hooks.json`, skills CLI trong `landing-nuxt\.agents\skills\`. Teanis CMS rules vẫn ở `.cursorrules` / file này — không nhầm với skill ponytail upstream.

#### Audit Figma OP2 (`Jxs4aII2hgoKk0DYddd3In`, About `1:659`) vs code @ ~1400px
- Đối chiếu từng section (Header → Footer): spacing section, badge 24/36, CTA icon 42px, Metrics gap desktop, v.v.
- **Chưa pixel-perfect** toàn trang; một số hạng mục cố ý giữ (footer `pt` overlap CTA, Metrics số dạng font thay vì SVG artwork Figma).

#### Pass chỉnh layout / spacing (theo audit)
- **Section padding**: ví dụ Company `lg:pt-32 lg:pb-[100px]`, Timeline/Core/Vision/Philosophy/Metrics `py`/`mb` theo token 128/100/80…
- **Header**: menu `gap-8`; CTA icon **42×42**, SVG 24px.
- **Company**: cột `gap-8`, title dot `text-ds-24`, H2 Teanis `text-ds-36 font-medium`.
- **Metrics @ xl**: `flex justify-between`, ô `w-[200px]`, label `text-ds-20`.
- **BrandPhilosophy**: section `lg:pt-32 lg:pb-[60px]`; nhãn thẻ `text-ds-48`; slogan đóng **một màu** `#141414` (khác Hero — GROWTH trắng).

#### Pass 2 typography (design tokens trong code)
- `tailwind.config.ts`: `fontSize` `text-ds-16` … `text-ds-82` map Figma variables (Lexend).
- `app/assets/css/figma-tokens.css` + `css: [...]` trong `nuxt.config.ts` (file phải nằm **`app/assets/`**, không phải root `assets/`).
- Rà soát component: thay `text-[18px] leading-[27px]` / `leading-snug` bằng `text-ds-*` ở Header, Hero, Company, Timeline, Vision, Core, Metrics, Footer, PreFooter, Hashtag, Philosophy.
- **Spacing nội khối**: ví dụ Company cột trái `gap-8`, Philosophy bỏ `mb-[100px]` giữa dot và H2 → `mb-8`, Vision dot block `mb-8`.
- **Còn lại / technical debt**:
  - Vision: badge `text-ds-24` cho cả chuỗi title dài — có thể cần tách ACF (badge ngắn + title 36 center).
  - Metrics: con số vẫn CSS `font-black`, chưa asset SVG như Figma.
  - Hero H1: `font-bold` (700) không `extrabold`; breakpoint giữa `lg:text-[74px]` và `xl:text-ds-82`.

#### `BrandPhilosophySection.vue` — GSAP & visual (các lần chỉnh trước trong phiên)
- **AQUA**: animation sóng (pivot teardrop từ `aqua-card.svg`).
- **IGNIS**: morph chậm + opacity flicker riêng; **box-shadow pulse** chỉ sau hover tween `0.35s`, `immediateRender: false` (tránh snap shadow khi hover).
- **VENTUS**: path SVG `fill="white"` `fill-opacity="0.6"` (khớp `ventus-card.svg`); reset opacity 0.6 on leave.
- GSAP: `onMounted` + `gsap.context`, cleanup `ctx.revert()` / kill tweens `onUnmounted`.

#### `CompanyInfoSection.vue` — overlay 10+ (Figma `1:781`)
- **Trước:** flex `items-center justify-center` → số 1/0/+ căn giữa, thiếu lệch dọc Figma, chữ nhỏ center trong vòng 0.
- **Sau:** wrapper `.experience-badge` trên poster video; từng asset **absolute %** theo khung `1:779` (627×431): `1` cao hơn (`top 25.51%`), `0` thấp hơn (`top 34.66%`), `+` `top 30.77%`; thêm layer **`exp-ring-inner.svg`**; copy **trái** `left 39.4%`, `font-size: 8.35cqh`, `line-height 1.5`, `letter-spacing -0.5px`.
- Nếu poster CMS lệch tỉ lệ ảnh, chỉnh % trong `<style scoped>` `.experience-badge__*`.

#### File đã đụng (tóm tắt)
- Layout: `TheHeader.vue`, `TheFooter.vue`
- Sections: `HeroSection`, `CompanyInfoSection`, `MetricsSection`, `TimelineSection`, `VisionMissionSection`, `CoreValuesSection`, `BrandPhilosophySection`, `PreFooterCtaSection`, `HashtagBar`
- Config: `tailwind.config.ts`, `nuxt.config.ts`, `app/assets/css/figma-tokens.css`

#### Việc nên làm tiếp (gợi ý cho phiên sau)
- Pre-footer layout so node `1:1017` với screenshot live.
- Pass 3: grep còn `text-[Npx]` / `leading-[` không cần thiết.

### Phiên làm việc: 17/11/2026

#### 1. Visual & Typography Polish (Phase 1)
- **VisionMissionSection**: Chuẩn hóa semantic: badge 24px (`subtitle`), tiêu đề 36px (`title`), lời dẫn (`vm_description`); thêm field ACF và sync WP.
- **CTA Profile & Icon standardization**: Link Google Slides presentation với `target="_blank"`, chuẩn hóa CTA button và icon box 42×42px trên Header, Hero, PreFooter.
- **Design Tokens**: Rà soát và áp dụng design tokens `text-ds-*` từ `figma-tokens.css`.

#### 2. SEO On-page & Yoast WPGraphQL (Phase 2)
- **Yoast SEO Integration**: Tích hợp `wordpress-seo` + `add-wpgraphql-seo`, tự động lấy SEO title, description, schema `@graph`, và rewrite domain CMS sang Frontend `siteUrl`.
- **Dynamic Site Icon / Favicon**: Bổ sung GraphQL field resolver `siteIconUrl` từ WordPress Core Options, đồng bộ favicon động toàn trang trong `app.vue`.
- **Audit SEOquake**: Khắc phục 14 ảnh thiếu thẻ ALT trong các section và footer; cập nhật Sitemap và Robots trong `nuxt.config.ts`.
- **Dọn dẹp ACF thừa**: Xóa các field SEO thủ công trong ACF để tránh dư thừa và xung đột với Yoast.

#### 3. Media Optimization & Trang Liên Hệ Contact (Phase 3)
- **Nén ảnh sang WebP**: Chuyển đổi 100% hình ảnh component sang WebP, nén `video-poster` từ 1.31 MB xuống 63.5 KB (giảm 95%), dọn sạch 1.35 MB file PNG cũ.
- **ACF Location Rules**: Cập nhật rule giới hạn 78 field landing page chỉ hiển thị trên Front Page (`isFrontPage: true`), tách biệt với trang Contact và các Pages khác.
- **Trang Contact (`/contact`)**: Xây dựng hoàn chỉnh [app/pages/contact.vue](file:///d:/wordpress/headless/landing-nuxt/app/pages/contact.vue) khớp chuẩn mockup:
  - Top mint banner với watermark "GET IN TOUCH" và họa tiết góc phải.
  - Form 2 khối: Nhu cầu & dropdown lĩnh vực + Thông tin 4 ô (Email, Họ tên, SĐT, Tên công ty) + nút "Gửi tin nhắn ↗".
  - Google Maps nhúng full-width định vị trụ sở Teanis Technologies (Thạnh Mỹ Lợi, TP. Thủ Đức).
  - Thẻ nổi "Follow us" chuẩn Figma Target: Định vị chồng biên giữa Map và Footer (loại bỏ dải trắng thừa), bố cục "Follow us" phía trên và 3 cột (Website, Email, Hotline) dàn đều phía dưới, kết hợp họa tiết sóng lượn mờ (organic wave overlay).
- **Hệ Thống Contact Form Chuẩn Headless (Nuxt Nitro + WP-Admin Leads)**:
  - Triển khai endpoint `/api/contact.post.ts` trên Nuxt Nitro có tích hợp Honeypot anti-spam.
  - Đăng ký Custom Post Type `contact_submission` ("Khách hàng liên hệ") cùng bảng quản trị trực quan và Meta Box chi tiết trong WordPress `wp-admin`.
  - Kết nối bảo mật Server-to-Server qua WordPress REST API nội bộ với secret key (`X-Headless-Secret`).
  - Cấu hình biến môi trường `CONTACT_RECEIVE_EMAIL` linh hoạt trong `.env`.
- **Navigation & Routing**: Header CTA và PreFooter CTA điều hướng trực tiếp sang `/contact`; thêm `/contact` vào sitemap.
- **SSR Build**: `npm run build` verify pass 100% không lỗi.

---

## 7. Mục Tiêu Triển Khai Thực Tế (Phân Kỳ Theo Ưu Tiên)

*(Các hạng mục nâng cao dành cho môi trường Production như Draft Preview, Revalidate Webhook... đã được tách và lưu trữ riêng tại [docs/archive/FUTURE_PRODUCTION_ROADMAP.md](file:///d:/wordpress/headless/landing-nuxt/docs/archive/FUTURE_PRODUCTION_ROADMAP.md)).*

### Phase 1: Hoàn Thiện Visual & Pixel Polish (Hoàn thành)
- [x] **Vision & Mission Section**: Tách tiêu đề section (`title` 36px, centered), nhãn dot (`subtitle` 24px) và lời dẫn (`vm_description` 18px), đồng bộ ACF và Nuxt schema.
- [x] **Pre-footer CTA & Header Buttons**: Chuẩn hóa kích thước CTA button và icon box 42x42px (Figma `_buttonLP/primary`) đồng bộ trên Header, Hero và PreFooter.
- [x] **Typography & Token Polish**: Toàn bộ heading và body text đã được đối soát, map sạch sẽ sang design tokens (`text-ds-16` đến `text-ds-82`). Bản build test SSR hoàn toàn pass không lỗi.

### Phase 2: SEO On-page & Structured Data (Hoàn thành theo chuẩn Yoast SEO)
- [x] **Tích hợp Yoast SEO + WPGraphQL**: Đã kết nối trực tiếp với plugin `wordpress-seo` và `add-wpgraphql-seo`. Toàn bộ dữ liệu SEO (SEO Title, Meta Description, OpenGraph, Canonical, và JSON-LD Schema `@graph`) được lấy tự động 100% từ Yoast SEO trên WordPress.
- [x] **Tự động Rewrite Domain CMS -> FE**: Schema raw và Canonical URL từ Yoast được tự động chuyển đổi từ `headless-landing.local` sang domain Frontend (`siteUrl`).
- [x] **Dọn dẹp ACF thừa**: Đã gỡ bỏ toàn bộ các field SEO tự tạo trong ACF để tránh trùng lặp dữ liệu, giữ CMS gọn gàng, chuẩn headless.
- [x] **Favicon đồng bộ từ WordPress Site Icon**: Expose `siteIconUrl` từ WordPress Core Options sang WPGraphQL; Nuxt tự động lấy ảnh Site Icon đã crop trên WordPress (`cropped-Teanis_horizontal.png`) làm favicon động toàn trang.
- [x] **Sitemap & Robots & Fix 14 ALT Images**: Khắc phục triệt để lỗi thiếu ALT trên 14 ảnh theo audit SEOquake, cấu hình robots.txt và sitemap routes chuẩn hóa. Build SSR pass 100%.

### Phase 3: Tối Ưu Hiệu Năng & Bàn Giao
- [x] **Tối ưu Media & Asset (Page Size reduction)**:
  - Chuyển đổi toàn bộ component sang sử dụng 100% định dạng `.webp` (`sound-icon.webp`, `hieu-qua.webp`, `play-icon.webp`, `card-bg-shape.webp`, `card-border-frame.webp`, `circle-arrows.webp`, các card S-F-P-B `card-s.webp`, `card-f.webp`, `card-p.webp`, `card-b.webp`).
  - Đã xóa sạch 1.35 MB các file `.png` cũ không dùng trong `public/images/`.
  - Nén ảnh nặng nhất trang (`video-poster.png` 1.31 MB) sang chuẩn WebP (`video-poster.webp` chỉ còn 63.5 KB — giảm tới **95% dung lượng**).
  - Tối ưu đóng gói JS bundle: Đồng bộ cơ chế import GSAP, loại bỏ hoàn toàn cảnh báo `INEFFECTIVE_DYNAMIC_IMPORT` giữa các chunk client.
- [x] **Trang Liên hệ (`/contact`) & Bản Đồ Google Maps Pixel-Perfect**:
  - Xây dựng hoàn chỉnh [app/pages/contact.vue](file:///d:/wordpress/headless/landing-nuxt/app/pages/contact.vue) khớp chuẩn design Figma mockup:
    - Banner watermark mint cyan "GET IN TOUCH" với chi tiết hoa văn góc phải.
    - Typography tiêu đề 2 dòng: "HÃY CHO CHÚNG TÔI BIẾT CHÚNG TÔI CÓ / THỂ GIÚP GÌ!" phối màu đen - xanh cyan chuẩn xác.
    - Form 2 khối: Khối 1 nhu cầu & lĩnh vực dropdown, Khối 2 thông tin liên hệ 4 ô (Email, Họ tên, SĐT, Tên công ty) + CTA "Gửi tin nhắn ↗".
    - Nhúng Google Maps toàn chiều rộng định vị chính xác trụ sở Teanis Technologies (Thạnh Mỹ Lợi, TP. Thủ Đức).
    - Thẻ "Follow us" 2 tông màu nổi bật chồng lớp map: chứa thông tin Website, Email, Hotline kèm icon cam bo tròn.
  - Cập nhật header navigation và sitemap route tự động nhận diện `/contact`. Build SSR thành công 100%.
- [x] **Bàn Giao Dự Án**: Cấu trúc code, schema GraphQL, token typography, SEO và hiệu năng đạt chuẩn theo Plan kỹ thuật Headless WP.





