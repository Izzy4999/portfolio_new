"use client";

import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Mail, MessageCircle } from "lucide-react";

import { ROUTES } from "@/lib/site";

import { ChatTrigger } from "./ChatTrigger";

const ICON_SIZE = 20;
const ICON_STROKE = 1.5;
const TAB_CLASS =
	"flex flex-1 flex-col items-center gap-1.5 border-t-2 pb-3 pt-2.5 text-[0.625rem] uppercase tracking-[0.2em] text-white transition-colors duration-150";

const tabBorder = (active: boolean): string => (active ? "border-saffron" : "border-transparent");

export const MobileTabBar = (): JSX.Element => {
	const pathname = usePathname() ?? ROUTES.home;

	return (
		<nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 flex bg-indigo lg:hidden">
			<Link href={ROUTES.home} className={`${TAB_CLASS} ${tabBorder(pathname === ROUTES.home)}`}>
				<Home size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />
				Home
			</Link>
			<Link href={ROUTES.work} className={`${TAB_CLASS} ${tabBorder(pathname.startsWith(ROUTES.work))}`}>
				<LayoutGrid size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />
				Work
			</Link>
			<ChatTrigger className={`${TAB_CLASS} border-transparent`}>
				<MessageCircle size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />
				AI chat
			</ChatTrigger>
			<Link href={ROUTES.contact} className={`${TAB_CLASS} ${tabBorder(pathname.startsWith(ROUTES.contact))}`}>
				<Mail size={ICON_SIZE} strokeWidth={ICON_STROKE} aria-hidden="true" />
				Contact
			</Link>
		</nav>
	);
};
