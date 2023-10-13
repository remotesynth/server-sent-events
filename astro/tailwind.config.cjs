/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      keyframes: {
        highlight: {
          "0%": {
            background: "#8f8",
          },
          "100%": {
            background: "none",
          },
        },
      },
      animation: {
        highlight: "highlight 2s",
      },
    },
  },
  plugins: [],
};
