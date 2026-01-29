import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8e8',
          100: '#faefc5',
          200: '#f5df8a',
          300: '#eecb4a',
          400: '#e6b821',
          500: '#D4AF37',
          600: '#b8912a',
          700: '#936d23',
          800: '#7a5823',
          900: '#674a22',
        },
        navy: {
          50: '#eef0f6',
          100: '#d4d8e8',
          500: '#3a4270',
          700: '#252a4a',
          800: '#1f2340',
          900: '#1a1f36',
        },
      },
    },
  },
  plugins: [],
};

export default config;
