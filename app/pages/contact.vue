<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Liên hệ — Teanis Technologies',
  description: 'Hãy cho chúng tôi biết chúng tôi có thể giúp gì! Chia sẻ về lĩnh vực và nhu cầu của bạn, chúng tôi sẽ phản hồi sớm.'
})

const form = ref({
  requirement: '',
  industry: '',
  email: '',
  fullName: '',
  phone: '',
  companyName: '',
  _hp: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const res = await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })
    if (res?.success) {
      submitted.value = true
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || err?.statusMessage || 'Đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
  } finally {
    isSubmitting.value = false
  }
}

const contactChannels = [
  {
    type: 'website',
    label: 'Website',
    value: 'www.teanis.com',
    href: 'https://teanis.com',
    target: '_blank'
  },
  {
    type: 'email',
    label: 'Email',
    value: 'contact@teanis.com',
    href: 'mailto:contact@teanis.com'
  },
  {
    type: 'phone',
    label: 'Hotline',
    value: '028 6251 5775',
    href: 'tel:02862515775'
  }
]
</script>

<template>
  <main class="min-h-screen bg-white">
    <!-- Top Green Mint Banner with watermark GET IN TOUCH -->
    <section class="relative bg-[#1de4d4] pt-[150px] pb-20 lg:pt-[190px] lg:pb-28 overflow-hidden flex items-center justify-center select-none">
      <!-- Decorative background accent in top-right -->
      <div class="absolute right-8 top-12 pointer-events-none opacity-25">
        <svg class="size-28 sm:size-36 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <span class="text-white/40 font-black text-5xl sm:text-7xl md:text-8xl lg:text-[130px] uppercase tracking-wider leading-none text-center">
        GET IN TOUCH
      </span>
    </section>

    <!-- Main Content Form Section -->
    <section class="max-w-[1400px] mx-auto px-6 sm:px-8 xl:px-0 py-16 lg:py-24">
      <div class="max-w-full mx-auto">
        <!-- Title matching image -->
        <h2 class="text-5xl/[1.5] lg:text-6xl/[1.5] font-bold text-[#141414] uppercase tracking-tight mb-4">
          HÃY CHO CHÚNG TÔI BIẾT <span class="text-[#00d1bc]">CHÚNG TÔI CÓ</span><br class="hidden sm:inline" />
          THỂ <span class="text-[#00d1bc]">GIÚP GÌ!</span>
        </h2>
        <p class="text-ds-16 sm:text-ds-18 text-gray-600 mb-12">
          Hãy chia sẻ về lĩnh vực và nhu cầu của bạn, chúng tôi sẽ phản hồi sớm.
        </p>

        <!-- Form Success State -->
        <div v-if="submitted" class="bg-[#F8FAFC] border border-gray-100 rounded-[20px] p-8 sm:p-12 text-center my-8">
          <div class="size-16 rounded-full bg-[#00d1bc]/20 text-[#00d1bc] flex items-center justify-center mx-auto mb-4">
            <svg class="size-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 class="text-ds-24 font-bold text-[#141414] mb-2">Gửi thông tin thành công!</h3>
          <p class="text-ds-16 text-gray-600">Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
        </div>

        <!-- Form Container -->
        <form v-else class="flex flex-col gap-10" @submit.prevent="handleSubmit">
          <!-- Honeypot anti-spam field (hidden) -->
          <input
            v-model="form._hp"
            type="text"
            name="_hp"
            tabindex="-1"
            autocomplete="off"
            class="hidden"
            aria-hidden="true"
          />

          <!-- Error Alert -->
          <div
            v-if="errorMessage"
            class="p-4 rounded-[8px] bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between"
          >
            <span>{{ errorMessage }}</span>
            <button type="button" class="text-red-400 hover:text-red-600 font-bold ml-2" @click="errorMessage = ''">✕</button>
          </div>
          
          <!-- Block 1: Bạn đang tìm kiếm gì? -->
          <div class="flex flex-col gap-5">
            <h2 class="text-xl sm:text-2xl font-bold text-[#141414]">
              Bạn đang tìm kiếm gì?
            </h2>

            <textarea
              v-model="form.requirement"
              rows="4"
              placeholder="Nhập nội dung hoặc yêu cầu của bạn"
              class="w-full p-4 rounded-[8px] border border-gray-200 focus:border-[#0709a2] focus:ring-1 focus:ring-[#0709a2] outline-none text-ds-16 text-[#141414] placeholder-gray-400 resize-none transition-colors"
            ></textarea>

            <div class="relative">
              <select
                v-model="form.industry"
                required
                class="w-full h-[52px] px-4 rounded-[8px] border border-gray-200 focus:border-[#0709a2] focus:ring-1 focus:ring-[#0709a2] outline-none text-ds-16 text-[#141414] bg-white appearance-none cursor-pointer transition-colors"
              >
                <option value="" disabled selected class="text-gray-400">Chọn lĩnh vực hoạt động *</option>
                <option value="software">Phát triển phần mềm (Software Development)</option>
                <option value="mobile">Ứng dụng di động (Mobile App)</option>
                <option value="iot">Giải pháp IoT (IoT Solutions)</option>
                <option value="ai">Trí tuệ nhân tạo (AI Solutions)</option>
                <option value="outsourcing">Dịch vụ Outsourcing</option>
                <option value="other">Lĩnh vực khác</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Block 2: Thông tin chi tiết của bạn -->
          <div class="flex flex-col gap-5">
            <h2 class="text-xl sm:text-2xl font-bold text-[#141414]">
              Thông tin chi tiết của bạn
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="Email *"
                class="w-full h-[52px] px-4 rounded-[8px] border border-gray-200 focus:border-[#0709a2] focus:ring-1 focus:ring-[#0709a2] outline-none text-ds-16 text-[#141414] placeholder-gray-400 transition-colors"
              />
              <input
                v-model="form.fullName"
                type="text"
                required
                placeholder="Họ và tên *"
                class="w-full h-[52px] px-4 rounded-[8px] border border-gray-200 focus:border-[#0709a2] focus:ring-1 focus:ring-[#0709a2] outline-none text-ds-16 text-[#141414] placeholder-gray-400 transition-colors"
              />
              <input
                v-model="form.phone"
                type="tel"
                required
                placeholder="Số điện thoại *"
                class="w-full h-[52px] px-4 rounded-[8px] border border-gray-200 focus:border-[#0709a2] focus:ring-1 focus:ring-[#0709a2] outline-none text-ds-16 text-[#141414] placeholder-gray-400 transition-colors"
              />
              <input
                v-model="form.companyName"
                type="text"
                placeholder="Tên công ty"
                class="w-full h-[52px] px-4 rounded-[8px] border border-gray-200 focus:border-[#0709a2] focus:ring-1 focus:ring-[#0709a2] outline-none text-ds-16 text-[#141414] placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-[#0709a2] hover:bg-[#050780] text-white rounded-[8px] pl-6 pr-2 py-1.5 h-[50px] inline-flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <span class="text-ds-18 font-medium">
                {{ isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn' }}
              </span>
              <div class="size-[38px] rounded-[4px] flex items-center justify-center shrink-0">
                <svg class="size-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Map & Follow Us Overlapping Section -->
    <section class="relative w-full overflow-visible z-20">
      <!-- Google Maps Iframe Container -->
      <div class="w-full h-[420px] sm:h-[480px] lg:h-[540px] bg-gray-100 relative z-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4383523782535!2d106.75170611092645!3d10.77769988932669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317525862e30de77%3A0x3c080356ae00c68b!2sTeanis%20Technologies!5e0!3m2!1svi!2sus!4v1794912379271!5m2!1svi!2sus"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full h-full"
        ></iframe>
      </div>

      <!-- Overlapping Follow Us Bar (Positioned exactly on boundary between Map and Footer) -->
      <div class="absolute left-0 right-0 bottom-0 translate-y-1/2 z-30 px-6 sm:px-8 xl:px-0 pointer-events-none">
        <div class="pointer-events-auto max-w-[1400px] mx-auto relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#20e9d6] px-6 py-8 sm:px-10 sm:py-9 lg:px-14 lg:py-10 shadow-2xl transition-all">
          <!-- Background Organic Curve Overlay from Figma -->
          <div class="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-1/2 pointer-events-none overflow-hidden select-none" aria-hidden="true">
            <svg class="w-full h-full object-cover" viewBox="0 0 600 240" fill="none" preserveAspectRatio="none">
              <path d="M100 240C110 130 190 35 320 20C400 10 500 0 600 0V240H100Z" fill="white" fill-opacity="0.18" />
              <path d="M250 240C260 150 330 60 430 30C500 10 550 5 600 0V240H250Z" fill="white" fill-opacity="0.22" />
            </svg>
          </div>

          <!-- Title: Follow us -->
          <h3 class="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#141414] tracking-tight mb-6 sm:mb-8 relative z-10">
            Follow us
          </h3>

          <!-- Contact items row (3 columns) matching Figma target -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative z-10">
            <a
              v-for="c in contactChannels"
              :key="c.label"
              :href="c.href"
              :target="c.target"
              :rel="c.target ? 'noopener noreferrer' : undefined"
              class="flex items-center gap-3.5 group"
            >
              <div class="size-11 sm:size-12 rounded-[10px] bg-[#f97c00] flex items-center justify-center shrink-0 shadow-sm text-white group-hover:scale-105 transition-transform">
                <svg v-if="c.type === 'website'" class="size-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <svg v-else-if="c.type === 'email'" class="size-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <svg v-else class="size-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-[#141414]/70 font-medium">{{ c.label }}</span>
                <span class="text-ds-16 sm:text-ds-18 font-bold text-[#141414] group-hover:text-[#0709a2] transition-colors">{{ c.value }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
