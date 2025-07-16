/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-reverse": "spin 2.5s linear infinite reverse",
      },
      textColor: {
        primary: "var(--color-text-primary)", //black color
        "primary-main": "var(--color-text-primary-main)", //blue color
        secondary: "var(--color-text-secondary)", //grey color
        white: "var(--color-white)", //white color
      },
      borderColor: {
        primary: "var(--border-primary)",
        main: "var(--color-text-primary)",
      },
      backgroundColor: {
        primary: "var(--color-bg-primary)", //blue color
        secondary: "var(--color-bg-secondary)", //transparent
        white: "var(--color-white)", //white color
      },
      colors: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        white: "var(--color-white)",
        "pink-custom": "#FFDEE9",
        "blue-custom": "#B5FFFC",
        "soft-pink": "#D6A4A4",
        "light-blue": "#DAE2F8",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(198deg, #00020a 29%, #000820 51%, #1e0138 100%)",
        "custom-gradient-hover": "radial-gradient(#175CD3,#095fe3)",
      },
      boxShadow: {
        custom: "0 0 10px rgba(0, 0, 0, 0.2)",
        custom1: "0 0 5px 5px #e7e5e5",
      },
      minHeight: {
        "screen-minus-240": "calc(100vh - 57px)",
      },
      transitionProperty: {
        width: "width",
        spacing: "margin, padding",
        height: "height",
        transform: "transform",
      },
      zIndex: {
        40: "40",
        50: "50",
        60: "60",
      },
    },
  },
  plugins: [],
};
