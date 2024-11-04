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
        primary: '#7C3AED',  // 紫色主题
        secondary: '#EC4899', // 粉色次要
        accent: '#06B6D4',    // 青色强调
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
      }
    },
  },
  plugins: [],
};
export default config;
