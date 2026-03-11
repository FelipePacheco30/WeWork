import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#005acd",
          700: "#0093cb",
          500: "#6dd7fd",
          300: "#bef0ff",
          50: "#f5ffff",
        },
      },
      boxShadow: {
        panel: "0 10px 30px rgba(0, 90, 205, 0.14)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
