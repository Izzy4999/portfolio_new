"use client";

import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CTA, ROUTES } from "@/lib/site";

import { ChatTrigger } from "./ChatTrigger";

const RAIL_LINKS = [
	{ label: "Home", href: ROUTES.home },
	{ label: "Work", href: ROUTES.work },
	{ label: "Contact", href: ROUTES.contact },
	{ label: "Socials", href: ROUTES.socials },
] as const;

const ITEM_CLASS =
	"group relative flex items-center gap-6 py-3.5 text-[0.6875rem] uppercase leading-none tracking-[0.28em] text-indigo";
const DOT_CLASS =
	"relative z-10 h-2.5 w-2.5 rounded-full border border-indigo transition-[background-color,transform] duration-200 ease-out-strong group-hover:scale-125";

const isActive = (pathname: string, href: string): boolean => {
	if (href === ROUTES.home) return pathname === ROUTES.home;
	if (href === ROUTES.socials) return false;
	return pathname.startsWith(href);
};

export const RailNav = (): JSX.Element => {
	const pathname = usePathname() ?? ROUTES.home;

	return (
		<nav aria-label="Main navigation" className="relative">
			<span aria-hidden="true" className="absolute bottom-5 left-[4.5px] top-5 w-px bg-indigo/30" />
			<ul>
				{RAIL_LINKS.slice(0, 2).map((link) => (
					<li key={link.href}>
						<Link href={link.href} className={ITEM_CLASS} aria-current={isActive(pathname, link.href) ? "page" : undefined}>
							<span className={`${DOT_CLASS} ${isActive(pathname, link.href) ? "bg-indigo" : "bg-cloud group-hover:bg-saffron"}`} />
							{link.label}
						</Link>
					</li>
				))}
				<li>
					<ChatTrigger className={ITEM_CLASS}>
						<span className={`${DOT_CLASS} bg-cloud group-hover:bg-saffron`} />
						{CTA.chat}
					</ChatTrigger>
				</li>
				{RAIL_LINKS.slice(2).map((link) => (
					<li key={link.href}>
						<Link href={link.href} className={ITEM_CLASS} aria-current={isActive(pathname, link.href) ? "page" : undefined}>
							<span className={`${DOT_CLASS} ${isActive(pathname, link.href) ? "bg-indigo" : "bg-cloud group-hover:bg-saffron"}`} />
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};
