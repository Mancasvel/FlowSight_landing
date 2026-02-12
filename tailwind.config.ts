import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: "#38bdf8",
          teal: "#00B8A9",
          brightCyan: "#00D9FF",
          blue: "#3B82F6",
        },
        secondary: {
          navy: "#0f172a",
          navyAlt: "#0A0A0F",
        },
        accent: {
          green: "#10B981",
          orange: "#F59E0B",
          red: "#EF4444",
        },
        background: {
          offWhite: "#f8f9fa",
          darkNavy: "#0f172a",
        },
        dashboard: {
          bg: "#0F172A",
          card: "#1E293B",
          border: "#334155",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        category: {
          coding: "#10B981",
          design: "#8B5CF6",
          communication: "#3B82F6",
          meeting: "#F59E0B",
          browsing: "#6B7280",
          sales: "#EC4899",
          other: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-satoshi)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "morph": "morph 8s ease-in-out infinite",
        "scroll": "scroll 40s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-mesh": "radial-gradient(at 27% 37%, #38bdf8 0px, transparent 50%), radial-gradient(at 97% 21%, #00B8A9 0px, transparent 50%), radial-gradient(at 52% 99%, #00D9FF 0px, transparent 50%), radial-gradient(at 10% 29%, #0ea5e9 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;
