"use client";
import { type JSX, type MouseEvent as ReactMouseEvent } from "react";

import { ArrowUpRight } from "lucide-react";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	useTransform,
	type Variants,
} from "framer-motion";
import type { Profile } from "@prisma/client";
import { CornerFrame } from "@/app/components/CornerFrame";
import { MagneticLink } from "@/app/components/MagneticLink";
import Particles from "@/app/components/particles";

interface HeroProps {
	profile: Profile;
}

const container: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item: Variants = {
	hidden: { opacity: 0, y: 8 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const line: Variants = {
	hidden: { y: "110%" },
	show: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const draft: Variants = {
	hidden: { pathLength: 0, opacity: 0 },
	show: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
};

const pad = (n: number): string => String(Math.round(n)).padStart(4, "0");

export const Hero = ({ profile }: HeroProps): JSX.Element => {
	const reduceMotion = useReducedMotion();
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const spotlight = useMotionTemplate`radial-gradient(480px circle at ${mouseX}px ${mouseY}px, rgba(255,61,26,0.14), transparent 72%)`;
	const coordLabel = useTransform([mouseX, mouseY], ([x, y]: number[]) => `X:${pad(x)} Y:${pad(y)}`);

	const handleMouseMove = (event: ReactMouseEvent<HTMLElement>): void => {
		if (reduceMotion) return;
		const rect = event.currentTarget.getBoundingClientRect();
		mouseX.set(event.clientX - rect.left);
		mouseY.set(event.clientY - rect.top);
	};

	return (
		<section
			onMouseMove={handleMouseMove}
			className="relative min-h-[100dvh] overflow-hidden border-b border-ink/15 px-6 pt-16 pb-20 lg:px-8 sm:pt-24 sm:pb-32"
		>
			<div
				aria-hidden="true"
				className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
			/>
			{reduceMotion ? null : (
				<Particles
					className="pointer-events-none absolute inset-0"
					quantity={70}
					staticity={40}
					ease={35}
					color="0, 229, 255"
				/>
			)}
			{reduceMotion ? null : (
				<motion.div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0"
					style={{ background: spotlight }}
				/>
			)}

			<svg
				aria-hidden="true"
				className="pointer-events-none absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] sm:inset-8 sm:h-[calc(100%-4rem)] sm:w-[calc(100%-4rem)]"
				fill="none"
			>
				<motion.rect
					x="0.5"
					y="0.5"
					width="calc(100% - 1px)"
					height="calc(100% - 1px)"
					stroke="rgba(244,244,242,0.16)"
					strokeWidth="1"
					initial={reduceMotion ? undefined : "hidden"}
					animate="show"
					variants={draft}
				/>
			</svg>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-4 top-4 hidden font-mono text-[10px] uppercase tracking-[0.1em] text-ink/30 sm:left-8 sm:top-8 sm:block"
			>
				FIG.01 / HERO
			</div>
			{reduceMotion ? null : (
				<motion.span
					aria-hidden="true"
					className="pointer-events-none absolute bottom-4 right-6 hidden font-mono text-[10px] uppercase tracking-[0.1em] text-ink/30 sm:block lg:right-8"
				>
					{coordLabel}
				</motion.span>
			)}

			<motion.div
				initial={reduceMotion ? undefined : "hidden"}
				animate="show"
				variants={container}
				className="relative flex h-full min-h-[calc(100dvh-9rem)] flex-col justify-center mx-auto max-w-5xl"
			>
				<motion.div variants={item} className="mb-8 flex items-center gap-4">
					<CornerFrame>
						<div className="flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink/70">
							<span
								className={`h-1.5 w-1.5 shrink-0 rounded-full ${
									profile.availability ? "bg-signal" : "bg-ink/30"
								} ${profile.availability && !reduceMotion ? "animate-pulse" : ""}`}
								aria-hidden="true"
							/>
							{profile.availability ? "Available for new projects" : "Currently unavailable"}
						</div>
					</CornerFrame>
					<span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-ink/40 sm:inline">
						{profile.role} - Lagos, NG
					</span>
				</motion.div>

				<h1 className="max-w-4xl text-[clamp(2.75rem,11vw,6rem)] font-black leading-[0.92] tracking-[-0.04em] text-ink [text-wrap:balance] lg:text-8xl">
					<span className="block overflow-hidden">
						<motion.span variants={reduceMotion ? undefined : line} className="block">
							{profile.name}
						</motion.span>
					</span>
				</h1>

				<motion.div variants={item} className="mt-6 flex items-start gap-4">
					<span className="mt-1 h-px w-10 shrink-0 bg-signal sm:mt-3 sm:w-16" aria-hidden="true" />
					<p className="max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
						{profile.bio}
					</p>
				</motion.div>

				<motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
					<MagneticLink
						href="/projects"
						className="group inline-flex items-center gap-3 bg-ink py-2.5 pl-5 pr-2.5 font-mono text-sm uppercase tracking-[0.04em] text-paper transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-6 hover:pr-3 active:scale-[0.97]"
					>
						View work
						<span className="flex h-7 w-7 items-center justify-center bg-signal text-ink transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
							<ArrowUpRight className="h-4 w-4" strokeWidth={2} />
						</span>
					</MagneticLink>

					<MagneticLink
						href="/contact"
						className="inline-flex items-center border border-ink/30 px-5 py-2.5 font-mono text-sm uppercase tracking-[0.04em] text-ink transition-colors duration-150 hover:border-ink hover:bg-ink hover:text-paper active:scale-[0.97]"
					>
						Get in touch
					</MagneticLink>
				</motion.div>
			</motion.div>
		</section>
	);
};
