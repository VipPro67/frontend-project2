/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = [
	"./index.html",
	"./src/**/*.{js,ts,jsx,tsx}",
	"*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
	extend: {
		colors: {
			facebook: {
				'50': '#eff3ff',
				'100': '#dbeafe',
				'200': '#bfdbfe',
				'300': '#93c5fd',
				'400': '#60a5fa',
				'500': '#3b82f6',
				'600': '#1877f2',
				'700': '#1d4ed8',
				'800': '#1e40af',
				'900': '#1e3a8a',
			},
			gray: {
				'50': '#f9fafb',
				'100': '#f3f4f6',
				'200': '#e5e7eb',
				'300': '#d1d5db',
				'400': '#9ca3af',
				'500': '#6b7280',
				'600': '#4b5563',
				'700': '#374151',
				'800': '#1f2937',
				'900': '#111827',
			},
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))',
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))',
			},
			primary: {
				DEFAULT: 'hsl(var(--primary))',
				foreground: 'hsl(var(--primary-foreground))',
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))',
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))',
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))',
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))',
			},
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))',
			},
		},
		fontFamily: {
			sans: ['Helvetica', 'Arial', 'sans-serif'],
		},
		boxShadow: {
			facebook: '0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)',
			'facebook-hover': '0 4px 8px rgba(0, 0, 0, .12), 0 12px 20px rgba(0, 0, 0, .12)',
		},
		borderRadius: {
			facebook: '8px',
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)',
		},
	},
};
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode,
	content,
	theme,
	plugins: [tailwindcssAnimate],
};
