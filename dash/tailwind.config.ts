import { type Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class", // Enable class-based dark mode
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)"],
				mono: ["var(--font-geist-mono)"],
				formula1: ["Formula1-Bold", "sans-serif"],
			},
			screens: {
				"3xl": "1800px",
			},
			colors: {
				popover: "rgba(37, 37, 37, 0.9)",
				// Theme-aware colors - using RGB values with proper syntax
				background: {
					DEFAULT: "rgb(var(--background))",
					secondary: "rgb(var(--background-secondary))",
				},
				foreground: {
					DEFAULT: "rgb(var(--foreground))",
					secondary: "rgb(var(--foreground-secondary))",
				},
				border: "rgb(var(--border))",
				accent: {
					DEFAULT: "rgb(var(--accent))",
					hover: "rgb(var(--accent-hover))",
				},
				muted: {
					DEFAULT: "rgb(var(--muted))",
					foreground: "rgb(var(--muted-foreground))",
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
