import { useMediaProxy } from '../composables/useMediaProxy'

/**
 * cleanAcfData: Tự động unwrap dữ liệu thô từ WPGraphQL/ACF.
 * - Media Node ({ node: { sourceUrl } }) -> URL đã qua Proxy
 * - Repeater đơn giản ([{ text: '...' }]) -> Mảng chuỗi (['...'])
 * - Đệ quy làm sạch object / array mà không cần mapping thủ công từng field.
 */
export function cleanAcfData<T = any>(data: any): T {
  if (data === null || data === undefined) return data

  // Trường hợp 1: WPGraphQL Media Item
  if (typeof data === 'object' && data.node && (data.node.sourceUrl || data.node.mediaItemUrl)) {
    const url = data.node.mediaItemUrl || data.node.sourceUrl
    return useMediaProxy().proxyUrl(url) as any
  }

  // Trường hợp 2: Array
  if (Array.isArray(data)) {
    return data.map((item) => {
      // Nếu là mảng repeater dạng [{ text: "abc" }]
      if (item && typeof item === 'object' && 'text' in item && Object.keys(item).length === 1) {
        return item.text
      }
      return cleanAcfData(item)
    }) as any
  }

  // Trường hợp 3: Object lồng nhau
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {}
    for (const [key, val] of Object.entries(data)) {
      cleaned[key] = cleanAcfData(val)
    }
    return cleaned as T
  }

  return data
}
