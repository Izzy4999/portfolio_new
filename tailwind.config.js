const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx}"],

	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						"code::before": {
							content: '""',
						},
						"code::after": {
							content: '""',
						},
					},
				},
			},
			colors: {
				paper: "#09090c",
				ink: "#f4f4f2",
				signal: "#00e5ff",
				cloud: "#f7f6f2",
				sky: "#dde5f4",
				indigo: { DEFAULT: "#2b2f7f", deep: "#1f2263" },
				madder: "#b23a65",
				saffron: "#f2b31a",
				plum: "#6a3d8f",
				umber: "#8a4a28",
			},
			transitionTimingFunction: {
				"out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
			},
			fontFamily: {
				canopy: ["var(--font-jost)", ...defaultTheme.fontFamily.sans],
				sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
				mono: ["var(--font-jetbrains-mono)", ...defaultTheme.fontFamily.mono],
			},
			borderRadius: {
				none: "0px",
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("tailwindcss-debug-screens")],
};
