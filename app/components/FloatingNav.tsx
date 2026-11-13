"use client";
import type { JSX } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface NavLink {
	href: string;
	label: string;
}

const links: NavLink[] = [
	{ href: "/projects", label: "Work" },
	{ href: "/contact", label: "Contact" },
];

export const FloatingNav = (): JSX.Element => {
	const pathname = usePathname();
	const reduceMotion = useReducedMotion();
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = useState(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setScrolled(latest > 24);
	});

	return (
		<header
			className={`sticky top-0 z-50 border-b bg-paper/90 backdrop-blur transition-[border-color,box-shadow] duration-300 ${
				scrolled ? "border-ink/20 shadow-[0_1px_0_rgba(244,244,242,0.06)]" : "border-ink/15"
			}`}
		>
			<nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 lg:px-8">
				<Link href="/" className="group">
					<motion.span
						whileHover={reduceMotion ? undefined : { rotate: -8, scale: 1.05 }}
						transition={{ type: "spring", stiffness: 300, damping: 15 }}
						className="flex h-8 w-8 items-center justify-center border border-ink/25 font-mono text-xs font-bold tracking-tight text-ink transition-colors duration-150 group-hover:border-signal group-hover:text-signal"
					>
						FT
					</motion.span>
				</Link>
				<div className="flex items-center gap-6">
					{links.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className="group relative py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink/50 transition-colors duration-150 hover:text-ink"
							>
								<span className={isActive ? "text-ink" : ""}>{link.label}</span>
								<span
									aria-hidden="true"
									className={`absolute -bottom-0.5 left-0 h-px w-full bg-signal transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
										isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
									}`}
									style={{ transformOrigin: "left" }}
								/>
							</Link>
						);
					})}
				</div>
			</nav>
		</header>
	);
};
