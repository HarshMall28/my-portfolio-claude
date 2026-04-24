import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '40px',
        xl: '64px',
        '2xl': '96px',
        '3xl': '128px',
      },
      maxWidth: {
        'content': '1200px',
      },
      colors: {
        'bg': '#000000',
        'surface': '#0A0A0A',
        'border': '#1A1A1A',
        'text-primary': '#FFFFFF',
        'text-muted': '#737373',
        'accent': '#60A5FA',
        'accent-dim': 'rgba(96,165,250,0.12)',
      },
      extend: {
        fontFamily: {
          spaceGrotesk: ['var(--font-space-grotesk)', 'sans-serif'],
          inter: ['var(--font-inter)', 'sans-serif'],
          mono: ['var(--font-mono)', 'monospace'],
        },
      },
    },
  },
  plugins: [],

}
export default config
