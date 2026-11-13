import type { JSX, ReactNode } from "react";
import "../global.css";
import { Inter, JetBrains_Mono, Jost } from "next/font/google";
import { Metadata } from "next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

import { SITE } from "@/lib/site";

import { Analytics } from "./components/analytics";
import { CurtainIntro } from "./components/CurtainIntro";
import { Providers } from "./components/canopy/Providers";
import { ChatWidget } from "./components/chat-widget";

const SITE_TITLE = `${SITE.wordmark} · ${SITE.role}, ${SITE.city}`;
const SITE_DESCRIPTION = `${SITE.name}. ${SITE.tagline}`;
// PNG fallback for browsers that ignore SVG icons; rendered from public/favicon.svg.
const FAVICON_PNG = "/favicon.png";

export const metadata: Metadata = {
	metadataBase: new URL(SITE.url),
	title: {
		default: SITE_TITLE,
		template: `%s | ${SITE.name}`,
	},
	description: SITE_DESCRIPTION,
	openGraph: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		url: SITE.url,
		siteName: SITE.wordmark,
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		card: "summary_large_image",
	},
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
		shortcut: FAVICON_PNG,
		apple: FAVICON_PNG,
	},
};

const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost" });
// Inter and JetBrains Mono stay loaded for the /admin area, which still uses them.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

const RootLayout = ({ children }: { children: ReactNode }): JSX.Element => {
	return (
		<html lang="en" className={[jost.variable, inter.variable, jetbrainsMono.variable].join(" ")}>
			<head>
				<Analytics />
			</head>
			<body className="bg-cloud font-canopy text-indigo antialiased">
				<CurtainIntro />
				<Providers>
					{children}
					<ChatWidget />
				</Providers>
				<VercelAnalytics />
			</body>
		</html>
	);
};

export default RootLayout;
