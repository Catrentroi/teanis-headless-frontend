# Historical Work Log Archive (November 2026)

Tài liệu này lưu trữ lịch sử các phiên làm việc và giai đoạn đã hoàn thành của dự án Headless WordPress + Nuxt 4 (Teanis).

---

## 1. Nhật Ký Chi Tiết Các Phiên Làm Việc Trước Đó

### Phiên làm việc: 20/11/2026 (Chiều & Cuối ngày)
- **GSAP Animation 4 Thẻ Core Values (`CoreValuesSection`)**:
  - Ghim màn hình (`pin: true`, `scrub: 1.2`, `end: '+=2400'`) tuần tự 5 bước xuất hiện 4 thẻ (S $\rightarrow$ F $\rightarrow$ P $\rightarrow$ B), nháy hover flash màu, làm mờ các thẻ khác (`opacity: 0.2`) rồi trượt vào grid và xoay vòng tròn mũi tên giữa.
- **Hiệu Ứng Giọt Nước & Background Ly (`BrandPhilosophySection`)**:
  - Giọt nước pha lê xám khói rơi chậm rãi (1.6s), chạm đáy loang nở thành chiếc ly kết hợp fade in và tan sương mờ.
- **Tối Ưu & Đồng Bộ Các Section**:
  - `TimelineSection`: Ghim full màn hình, tách 8 file SVG line & disc, vẽ runway line và bung mốc thời gian tuần tự; `MetricsSection`: tối ưu counter odometer; `VisionMissionSection`: chuyển thành section tĩnh.

### Phiên làm việc: 12/11/2026
- **Header & Hero**: Chuyển TheHeader thành card nổi cố định (`fixed top-0`, `max-w-[1400px]`). HeroSection tách chữ "GROWTH" trắng, tích hợp hashtag marquee.
- **Section 03 (Company Info)**: Cố định các layer đồ họa card video 10+ năm kinh nghiệm. Thêm text field độc lập tránh bị biến thành bullet list.
- **WordPress & ACF Fixes**: Chuẩn hóa JSON UTF-8 không BOM, sửa lỗi mojibake font tiếng Việt. Sync 78 trường ACF vào Local WP.
- **Typography & Components**: Thống nhất dùng font Lexend. Cập nhật `VisionMissionSection`, `CoreValuesSection`, `TimelineSection` và `BrandPhilosophySection` (WYSIWYG editor, hệ thống background SVG và hiệu ứng hover 4 nguyên tố).

### Phiên làm việc: 16/11/2026
- **Công cụ & quy trình (Ponytail)**: Cài upstream ponytail skills CLI trong `.agents/skills/`.
- **Audit Figma OP2**: Đối chiếu từng section từ Header đến Footer theo mockup Figma.
- **Pass chỉnh layout & spacing**: Chuẩn hóa padding, menu gap, nút CTA 42x42px.
- **Design Tokens**: Rà soát `figma-tokens.css` và `tailwind.config.ts`, map toàn bộ text sang `text-ds-*`.
- **GSAP & Visual**: Hoàn thiện animation sóng nước, ngọn lửa, gió lướt cho 4 thẻ nguyên tố tại `BrandPhilosophySection.vue`. Chuẩn hóa overlay 10+ năm kinh nghiệm tại `CompanyInfoSection.vue`.

### Phiên làm việc: 17/11/2026
- **Visual & Typography Polish**: VisionMissionSection chuẩn hóa semantic badge 24px, title 36px, description 18px. Chuẩn hóa kích thước CTA button và icon box 42x42px trên Header, Hero, PreFooter. Áp dụng design tokens `text-ds-*`.
- **SEO On-page & Yoast WPGraphQL**: Tích hợp `wordpress-seo` + `add-wpgraphql-seo`, tự động lấy SEO title, description, schema `@graph`, và rewrite domain CMS sang Frontend. Bổ sung `siteIconUrl` làm dynamic favicon. Audit SEOquake xử lý 14 ảnh thiếu thẻ ALT.
- **Media Optimization & Trang Contact**: Nén ảnh sang WebP (giảm 95% video-poster), dọn sạch PNG cũ. Xây dựng hoàn chỉnh trang `/contact` gồm form 2 khối, Google Maps, thẻ Follow Us, và Custom Post Type lưu lead trong WP-Admin.

### Phiên làm việc: 18/11/2026
- **Cloud Hosting Architecture**: Chốt kiến trúc decoupled với WordPress Backend trên Pantheon.io Sandbox và Nuxt Frontend trên Vercel. Thiết lập `.env.example` và cập nhật `.gitignore`.
- **Server-Side Image Proxy (`/api/media`)**: Giải quyết triệt để lỗi CORS / NotSameOrigin từ Cloudflare của Pantheon bằng route Nitro `/api/media` và composable `useMediaProxy`.
- **Pre-Footer CTA Polish**: Cấu hình chuẩn ảnh minh họa `cta-frame.svg` và tinh chỉnh layout lấn dòng.
- **Dọn dẹp mã nguồn & asset rác**: Xóa component thừa `HashtagBar.vue`, `AppButton.vue` và 16 file ảnh không sử dụng trong `public/images/`.
---

## 2. Các Giai Đoạn Đã Hoàn Thành (Milestones Checklist)

### Phase 1: Hoàn Thiện Visual & Pixel Polish (Hoàn thành)
- [x] Vision & Mission Section đồng bộ ACF và Nuxt schema.
- [x] Pre-footer CTA & Header Buttons đồng bộ chuẩn Figma.
- [x] Typography & Token Polish đối soát sang `figma-tokens.css`.

### Phase 2: SEO On-page & Structured Data (Hoàn thành theo chuẩn Yoast SEO)
- [x] Tích hợp Yoast SEO + WPGraphQL tự động mapping sang `useSeoMeta()`.
- [x] Tự động rewrite domain CMS sang domain Frontend `siteUrl`.
- [x] Dọn dẹp các field SEO thủ công thừa trong ACF.
- [x] Sitemap & Robots & xử lý đầy đủ thẻ ALT ảnh.

### Phase 3: Tối Ưu Hiệu Năng & Bàn Giao
- [x] Chuyển đổi toàn bộ component sang sử dụng 100% định dạng `.webp`.
- [x] Trang Liên hệ (`/contact`) & Bản Đồ Google Maps hoàn thiện.
- [x] Nitro Proxy `/api/media` và `/api/contact` bảo mật Server-to-Server.
- [x] Bàn giao cấu trúc Headless WP chuẩn xác.

### Phiên làm việc: 19/11/2026 (Sáng & Chiều)
- **Zero-Boilerplate & Tinh gọn Codebase (/ponytail)**:
  - Thiết lập `docs/DESIGN_PATTERNS.md` (GSAP SSR-Safe, WPGraphQL auto-cleaner, Node UTF-8 sync script).
  - Thu gọn `index.vue` và `about.vue` (-85% code) bằng cú pháp `v-bind` và `usePageSeo()`; refactor `useAboutPage.ts` (294 -> 147 dòng) và các section components.
- **Gia cố Bảo mật Production**: Ẩn domain WordPress khỏi client bundle, chặn `__schema`/`__type`/`users` tại `server/api/graphql.post.ts`, tắt cache `/api/**`.
- **Triển khai Production (Vercel + Pantheon)**: Đồng bộ 79 trường ACF Pro, xử lý lỗi mất Body/ISR, hoàn thiện `contact.post.ts`.
- **Hoạt họa SVG & Hiệu năng**: Xây dựng `InlineSvg.vue`, tự động wrap nhóm SVG trong `HeroSection.vue`, tạm dừng tween ngoài viewport bằng `IntersectionObserver`.
