# Kế Hoạch Triển Khai Nâng Cao / Production (Archive Backup)

> **Lưu ý**: Đây là tài liệu lưu trữ (archive) các mục tiêu kỹ thuật dài hạn và tính năng nâng cao cho môi trường Production/Staging từ bản kế hoạch Headless WordPress ban đầu. Tạm thời chưa triển khai ở môi trường Local Dev để tránh over-engineering.

---

## 1. Backend & Server Routes (Nuxt Server Nitro)
- [x] **Form Proxy Route (`server/api/contact.post.ts`)**: Đã hoàn thành theo chuẩn Hybrid Headless: Nuxt Nitro tiếp nhận form, xác thực Honeypot, gửi mail SMTP và đồng bộ tạo bản ghi vào CPT `contact_submission` trong WordPress WP-Admin.
- [ ] **On-demand Revalidation (`server/api/revalidate.post.ts`)**: Nhận webhook payload từ WordPress (khi lưu post/page trong WP-Admin), kiểm tra secret token (`x-webhook-secret`) và purge/refresh cache ISR Nuxt.
- [ ] **Draft Preview Handler (`server/api/preview.get.ts`)**: Hỗ trợ tính năng "Preview" bài viết/trang nháp từ WP-Admin hiển thị trực tiếp trên giao diện Nuxt mà không cần publish (yêu cầu JWT / Application Passwords).

## 2. Các Hạng Mục Production Mở Rộng
- [ ] **Cấu hình Reverse Proxy / CDN Caching**: Cloudflare CDN Edge Cache rules cho asset và media WordPress.
- [ ] **Bảo mật Server-to-Server**: Thiết lập Application Passwords và phân quyền nghiêm ngặt các REST/GraphQL endpoints.

---

## 3. Hướng Dẫn Triển Khai Hosting 0đ (Pantheon.io + Vercel)

### Bước 1: Khởi tạo WordPress Backend trên Pantheon.io
1. Truy cập [pantheon.io](https://pantheon.io/) và đăng ký tài khoản miễn phí (bằng Google/Email).
2. Tạo Site mới: Chọn **WordPress** (Gói Sandbox / Dev miễn phí trọn đời).
3. Đặt tên site (ví dụ `teanis-cms`), Pantheon sẽ cấp URL dạng: `https://dev-teanis-cms.pantheonsite.io`.
4. Hoàn tất cài đặt WordPress trên giao diện web của Pantheon.

### Bước 2: Di chuyển Plugin & Dữ liệu từ LocalWP lên Pantheon
1. Đăng nhập `wp-admin` trên Pantheon, cài đặt các plugin cốt lõi:
   - `wp-graphql`, `advanced-custom-fields-pro`, `wpgraphql-acf`, `wordpress-seo`, `add-wpgraphql-seo`.
2. Sao chép file `wp-content/mu-plugins/headless-config.php` lên Pantheon qua giao diện SFTP hoặc Git của Pantheon.
3. Import dữ liệu ACF từ file `d:\wordpress\headless\acf-about-page.json` hoặc chạy webhook sync `?sync_acf=<your_sync_secret>`.
4. Export database hoặc bài viết trang từ LocalWP (dùng plugin *Duplicator Pro* hoặc *All-in-One WP Migration*) và import vào Pantheon.

### Bước 3: Deploy Frontend Nuxt 4 lên Vercel
1. Đẩy mã nguồn `landing-nuxt` lên kho lưu trữ **GitHub**.
2. Truy cập [vercel.com](https://vercel.com/), chọn **Add New Project** và liên kết với repo GitHub vừa đẩy.
3. Trong phần **Environment Variables** trên Vercel, thiết lập các biến:
   - `WP_GRAPHQL_URL`: `https://dev-teanis-cms.pantheonsite.io/graphql`
   - `WP_API_URL`: `https://dev-teanis-cms.pantheonsite.io/wp-json`
   - `WP_DOMAIN`: `dev-teanis-cms.pantheonsite.io`
   - `SITE_URL`: `https://teanis.com`
   - `WP_HEADLESS_SECRET`: `<chuoi_secret_ngau_nhien_do_ban_tu_dat>`
   - `CONTACT_RECEIVE_EMAIL`: `contact@teanis.com`
4. Nhấn **Deploy**. Vercel sẽ tự động build và cấp phát URL xem trước.

### Bước 4: Trỏ Tên Miền Chính (Cloudflare DNS)
1. Thêm domain `teanis.com` vào Vercel (mục Settings -> Domains).
2. Cấu hình bản ghi CNAME hoặc A trên **Cloudflare DNS** trỏ về máy chủ Vercel.
3. Hoàn tất: Khách truy cập vào `https://teanis.com` sẽ được phục vụ từ mạng Vercel siêu tốc, dữ liệu tự động đồng bộ từ Pantheon CMS.
