// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: [
        './app/**/*.{vue,js,ts}',
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './composables/**/*.{js,ts}',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
    ],
    plugins: [
        require('@tailwindcss/typography')
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lexend', 'sans-serif'],
                lexend: ['Lexend', 'sans-serif'],
            },
            fontSize: {
                'ds-16': ['16px', { lineHeight: '24px' }],
                'ds-18': ['18px', { lineHeight: '27px' }],
                'ds-20': ['20px', { lineHeight: '30px' }],
                'ds-24': ['24px', { lineHeight: '36px' }],
                'ds-36': ['36px', { lineHeight: '54px' }],
                'ds-48': ['48px', { lineHeight: '72px' }],
                'ds-82': ['82px', { lineHeight: '1.5' }],
            },
        },
    },
}