/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        gotham: ["Gotham", "sans-serif"],
      },
      fontWeight: {
        light: 300,
        normal: 400,
      },
      screens: {
        CT: "900px",
        XS: "400px",
        XS1: "420px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
