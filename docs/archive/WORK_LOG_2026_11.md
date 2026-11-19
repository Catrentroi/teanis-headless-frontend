# Historical Work Log Archive (November 2026)

Tài liệu này lưu trữ lịch sử các phiên làm việc và giai đoạn đã hoàn thành của dự án Headless WordPress + Nuxt 4 (Teanis).

---

## 1. Nhật Ký Chi Tiết Các Phiên Làm Việc Trước Đó

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
