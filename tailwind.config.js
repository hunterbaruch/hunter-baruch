module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(210 16% 89%)",
        input: "hsl(210 16% 89%)",
        ring: "hsl(158 88% 28%)",
        background: "hsl(210 25% 97%)",
        foreground: "hsl(210 32% 16%)",
        primary: {
          DEFAULT: "hsl(158 88% 28%)",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(158 82% 20%)",
          foreground: "hsl(0 0% 100%)",
        },
        tertiary: {
          DEFAULT: "hsl(210 56% 14%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(210 18% 95%)",
          foreground: "hsl(210 14% 39%)",
        },
        accent: {
          DEFAULT: "hsl(158 35% 95%)",
          foreground: "hsl(210 32% 16%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(210 32% 16%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(210 32% 16%)",
        },
        success: {
          DEFAULT: "hsl(150 68% 32%)",
          foreground: "hsl(0 0% 100%)",
        },
        warning: {
          DEFAULT: "hsl(38 92% 45%)",
          foreground: "hsl(210 32% 16%)",
        },
        gray: {
          50: "hsl(210 20% 98%)",
          100: "hsl(210 18% 95%)",
          200: "hsl(210 16% 89%)",
          300: "hsl(210 14% 80%)",
          400: "hsl(210 12% 66%)",
          500: "hsl(210 11% 50%)",
          600: "hsl(210 14% 39%)",
          700: "hsl(210 18% 29%)",
          800: "hsl(210 24% 20%)",
          900: "hsl(210 32% 12%)",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "sans-serif"],
        serif: ['"Source Serif Pro"', "serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, hsl(210 56% 14%) 0%, hsl(158 82% 20%) 100%)",
        "gradient-soft":
          "linear-gradient(180deg, hsl(210 25% 99%) 0%, hsl(158 35% 95%) 100%)",
        "button-border-gradient":
          "linear-gradient(135deg, hsl(158 88% 28%) 0%, hsl(210 56% 14%) 100%)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.75rem",
        sm: "0.5rem",
        pill: "999px",
      },
      spacing: {
        4: "1rem",
        8: "2rem",
        12: "3rem",
        16: "4rem",
        24: "6rem",
        32: "8rem",
        48: "12rem",
        64: "16rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 24s linear infinite",
      },
    },
  },
  // Tailwind configs are CommonJS; require is the supported plugin load path.
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- CJS config
  plugins: [require("tailwindcss-animate")],
};
