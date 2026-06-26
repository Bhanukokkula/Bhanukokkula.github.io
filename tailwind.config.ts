import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fafaf8',
          100: '#f3ede6',
          200: '#e8e3dc',
          300: '#d5cdc4',
        },
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.neutral.600'),
            '--tw-prose-headings': theme('colors.neutral.900'),
            '--tw-prose-lead': theme('colors.neutral.600'),
            '--tw-prose-links': theme('colors.neutral.900'),
            '--tw-prose-bold': theme('colors.neutral.900'),
            '--tw-prose-counters': theme('colors.neutral.400'),
            '--tw-prose-bullets': theme('colors.neutral.300'),
            '--tw-prose-hr': theme('colors.cream.200'),
            '--tw-prose-quotes': theme('colors.neutral.700'),
            '--tw-prose-quote-borders': theme('colors.cream.300'),
            '--tw-prose-code': theme('colors.neutral.800'),
            '--tw-prose-pre-code': theme('colors.neutral.200'),
            '--tw-prose-pre-bg': theme('colors.neutral.900'),
            '--tw-prose-th-borders': theme('colors.cream.200'),
            '--tw-prose-td-borders': theme('colors.cream.100'),
            maxWidth: 'none',
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.neutral.400'),
            '--tw-prose-headings': theme('colors.neutral.50'),
            '--tw-prose-lead': theme('colors.neutral.400'),
            '--tw-prose-links': theme('colors.neutral.50'),
            '--tw-prose-bold': theme('colors.neutral.50'),
            '--tw-prose-counters': theme('colors.neutral.500'),
            '--tw-prose-bullets': theme('colors.neutral.700'),
            '--tw-prose-hr': theme('colors.neutral.800'),
            '--tw-prose-quotes': theme('colors.neutral.300'),
            '--tw-prose-quote-borders': theme('colors.neutral.700'),
            '--tw-prose-code': theme('colors.neutral.200'),
            '--tw-prose-pre-code': theme('colors.neutral.200'),
            '--tw-prose-pre-bg': 'rgba(0,0,0,0.4)',
            '--tw-prose-th-borders': theme('colors.neutral.700'),
            '--tw-prose-td-borders': theme('colors.neutral.800'),
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
