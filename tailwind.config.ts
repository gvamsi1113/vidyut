import type { Config } from 'tailwindcss';

const config: Config = {
  // Specifies which files Tailwind should scan to find class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Adds custom background gradient utilities
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      // Adds custom colors that can be used like: text-console-bg, bg-text-primary, etc.
      colors: {
        'console-bg': '#333',
        'console-border': '#555',
        'screen-bg': '#000',
        'header-bg': '#222',
        'text-primary': '#00ff00',
        'text-secondary': '#ffff00',
        'button-primary': '#ff0066',
        'button-secondary': '#00ddff',
        'panel-bg': '#444',
      },
    },
  },

  // Optional plugins to extend Tailwind's functionality
  plugins: [],
};

export default config;
