import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Primary
        'dark-grey': '#272926',
        'muted-olive': '#7B815C',
        'white': '#FFFFFF',
        // Brand Colors - Secondary (use sparingly)
        'yellow-agave': '#A29037',
        'terracotta': '#B86744',
        // CSS Variables for theming
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'logo': ['Gotham Condensed', 'sans-serif'],
        'sans': ['Open Sans', 'sans-serif'],
      },
      letterSpacing: {
        'logo': '0.077em',
        'heading': '0.06em',
        'headline': '0.015em',
        'body': '0.03em',
      },
    },
  },
  plugins: [],
};
export default config;