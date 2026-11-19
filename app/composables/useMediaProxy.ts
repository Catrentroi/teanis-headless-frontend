/**
 * useMediaProxy: Convert bất kỳ URL ảnh WordPress nào thành URL proxy nội bộ Nuxt.
 * Trình duyệt gọi /api/media?url=... (cùng domain FE) → Nitro tự fetch về từ WP.
 * Kết quả: Không bao giờ bị CORS / ERR_BLOCKED_BY_RESPONSE.NotSameOrigin.
 */
export function useMediaProxy() {
  function proxyUrl(wpMediaUrl?: string | null, fallback: string = ''): string {
    if (!wpMediaUrl) return fallback
    // Ảnh local (đã trong /public) thì giữ nguyên, không proxy
    if (wpMediaUrl.startsWith('/') || wpMediaUrl.startsWith('data:')) return wpMediaUrl
    return `/api/media?url=${encodeURIComponent(wpMediaUrl)}`
  }

  return { proxyUrl }
}
