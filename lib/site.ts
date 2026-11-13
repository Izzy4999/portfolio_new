export const SITE = {
	name: "Favour Israel Taiwo",
	wordmark: "Favour Taiwo",
	role: "Software engineer",
	city: "Lagos",
	timeZone: "Africa/Lagos",
	tagline:
		"Software engineer in Lagos. I build the web app and the mobile app for the same product.",
	email: "favour.israel.taiwo@outlook.com",
	url: "https://portfolio-new-theta-amber.vercel.app",
} as const;

export const ROUTES = {
	home: "/",
	work: "/projects",
	contact: "/contact",
	socials: "/contact#socials",
} as const;

export const SOCIALS = [
	{ label: "GitHub", href: "https://github.com/Izzy4999" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/in/favour-taiwo-8b9b5a200" },
] as const;

export const CTA = {
	work: "See my work",
	contact: "Say hello",
	chat: "Ask the AI",
} as const;

export const CHAT_OPEN_EVENT = "portfolio:open-chat" as const;

export const CHAT_STARTERS = [
	"What are Favour's main skills?",
	"Which projects have both a web and a mobile app?",
	"Is he available for hire?",
] as const;

export const HOME_PROJECTS = {
	// Umley has no uploaded phone screen yet, so its write-up image joins the phone rotation.
	heroMobile: "umley",
	rotateMs: 4500,
	featured: "consultation",
	cardCount: 3,
} as const;

export const STACK = [
	{ area: "Web", tools: "Next.js, React, TypeScript, Tailwind" },
	{ area: "Mobile", tools: "React Native, Expo, NativeWind" },
	{ area: "Backend", tools: "Node.js, Express, Go" },
	{ area: "Data", tools: "Prisma, Postgres, MongoDB" },
] as const;

export const GITHUB_BASE_URL = "https://github.com/" as const;
export const LOCAL_TIME_REFRESH_MS = 30_000;
