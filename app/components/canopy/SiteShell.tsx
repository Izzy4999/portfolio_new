import type { JSX, ReactNode } from "react";
import Link from "next/link";

import { ROUTES, SITE } from "@/lib/site";

import { LocalTime } from "./LocalTime";
import { LogoMark } from "./LogoMark";
import { MobileTabBar } from "./MobileTabBar";
import { RailNav } from "./RailNav";
import { SocialLinks } from "./SocialLinks";

const WORDMARK_CLASS = "text-lg font-light uppercase tracking-[0.42em] text-indigo";

export const SiteShell = ({ children }: { children: ReactNode }): JSX.Element => (
	<div className="relative min-h-[100dvh] pb-16 lg:pb-0 lg:pl-52">
		<aside className="fixed inset-y-0 left-0 z-30 hidden w-52 flex-col justify-between py-9 pl-10 lg:flex">
			<Link href={ROUTES.home} className={WORDMARK_CLASS}>
				<LogoMark className="mb-4 block h-8 w-auto" />
				{SITE.wordmark}
			</Link>
			<RailNav />
			<LocalTime />
		</aside>

		<header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 lg:hidden">
			<Link href={ROUTES.home} className={`${WORDMARK_CLASS} flex items-center gap-3 max-lg:text-white`}>
				<LogoMark className="h-6 w-auto" cursorClassName="fill-saffron" />
				{SITE.wordmark}
			</Link>
		</header>

		<main>{children}</main>

		<footer className="flex flex-wrap items-center justify-between gap-4 border-t border-indigo/25 px-6 py-8 lg:pl-12 lg:pr-28">
			<p className="caps text-indigo">{SITE.name}</p>
			<SocialLinks className="flex gap-8" />
		</footer>

		<MobileTabBar />
	</div>
);
