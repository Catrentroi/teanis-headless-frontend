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



*(Lịch sử các phiên làm việc chi tiết trước ngày 19/11/2026 đã được lưu trữ tại [docs/archive/WORK_LOG_2026_11.md](file:///d:/wordpress/headless/landing-nuxt/docs/archive/WORK_LOG_2026_11.md)).*

### Phiên làm việc: 19/11/2026 (Sáng & Chiều) - Rolling Window
- **Zero-Boilerplate & Tinh gọn Codebase (/ponytail)**:
  - Thiết lập [docs/DESIGN_PATTERNS.md](file:///d:/wordpress/headless/landing-nuxt/docs/DESIGN_PATTERNS.md) (GSAP SSR-Safe, WPGraphQL auto-cleaner, Node UTF-8 sync script).
  - Thu gọn `index.vue` và `about.vue` (-85% code) bằng cú pháp `v-bind="pageData.sectionName"` và composable `usePageSeo()`.
  - Refactor `useAboutPage.ts` (294 -> 147 dòng, -50%), xóa bỏ triệt để việc ép chuỗi rỗng `|| ''` để phục hồi default props và `v-if`.
  - Tinh giản Section components (`CoreValuesSection.vue`, `CompanyInfoSection.vue`), dọn sạch code trùng lặp.
- **Gia cố Bảo mật Production (Enterprise-Grade Security)**:
  - Ẩn hoàn toàn domain WordPress khỏi Client JS bundle (chuyển `wpDomain`, `wpGraphqlUrl`, `wpApiUrl` vào Private Runtime Config).
  - Kích hoạt bộ lọc chặn quét cây trường ACF (`__schema`, `__type`) và chặn dò danh mục Admin (`users`) tại `server/api/graphql.post.ts` (403 Forbidden).
  - Xóa sạch key hardcode `teanis_secret_lead_2026` trong code và tài liệu; chuẩn hóa placeholder an toàn trong [.env.example](file:///d:/wordpress/headless/landing-nuxt/.env.example).
  - Vô hiệu hóa cache cho toàn bộ route API (`routeRules: { '/api/**': { cache: false, isr: false } }`).
- **Triển khai Production Hoàn tất (Vercel + Pantheon)**:
  - Đồng bộ thành công 79 trường ACF Pro lên Pantheon Cloud qua webhook sync `?sync_acf=secret123`.
  - Xử lý triệt để lỗi mất Body trên Vercel do lệch schema và bộ đệm ISR 1 tiếng.
  - Tự động suy luận link REST API từ `WP_GRAPHQL_URL` và nâng cấp xử lý lỗi form tại `server/api/contact.post.ts`.
  - Website production `https://teanis-headless-frontend.vercel.app/` kết nối trực tiếp Pantheon hoạt động mượt mà 100%.

---

## 7. Trạng Thái Dự Án & Các Giai Đoạn Tiếp Theo
- Toàn bộ Phase 1, 2, 3 (Giao diện, Visual Polish, SEO Yoast, Hiệu năng WebP, Trang Contact) đã **hoàn thành 100%**.
- Các hạng mục mở rộng tương lai (Draft Preview, On-demand Revalidation Webhook) được theo dõi tại [docs/archive/FUTURE_PRODUCTION_ROADMAP.md](file:///d:/wordpress/headless/landing-nuxt/docs/archive/FUTURE_PRODUCTION_ROADMAP.md).
- Chi tiết lịch sử các phase: xem tại [docs/archive/WORK_LOG_2026_11.md](file:///d:/wordpress/headless/landing-nuxt/docs/archive/WORK_LOG_2026_11.md).





