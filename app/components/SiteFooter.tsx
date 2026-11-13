"use client";
import { type JSX, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "@prisma/client";
import { CornerFrame } from "@/app/components/CornerFrame";
import { MagneticLink } from "@/app/components/MagneticLink";

interface SiteFooterProps {
	profile: Profile;
}

interface IconProps {
	className?: string;
}

const GithubIcon = ({ className }: IconProps): JSX.Element => (
	<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
		<path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
	</svg>
);

const LinkedinIcon = ({ className }: IconProps): JSX.Element => (
	<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
		<path d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
	</svg>
);

const SCRAMBLE_GLYPHS = "!<>-_\\/[]{}=+*^?#";

const useScrambleHover = (finalText: string): { display: string; onEnter: () => void; onLeave: () => void } => {
	const [display, setDisplay] = useState(finalText);

	const onEnter = (): void => {
		let frame = 0;
		const totalFrames = 12;
		const id = setInterval(() => {
			frame += 1;
			setDisplay(
				finalText
					.split("")
					.map((char, i) => {
						if (char === " ") return " ";
						const revealAt = (i / finalText.length) * totalFrames;
						return frame > revealAt
							? char
							: SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
					})
					.join(""),
			);
			if (frame >= totalFrames) {
				setDisplay(finalText);
				clearInterval(id);
			}
		}, 35);
	};

	const onLeave = (): void => setDisplay(finalText);

	return { display, onEnter, onLeave };
};

export const SiteFooter = ({ profile }: SiteFooterProps): JSX.Element => {
	const reduceMotion = useReducedMotion();
	const heading = useScrambleHover("something.");
	const socials = [
		profile.github ? { icon: GithubIcon, href: profile.github, label: "GitHub" } : null,
		profile.linkedin ? { icon: LinkedinIcon, href: profile.linkedin, label: "LinkedIn" } : null,
	].filter((social): social is NonNullable<typeof social> => social !== null);

	return (
		<footer className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 sm:py-28">
			<motion.div
				initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.4 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end"
			>
				<div>
					<h2
						onMouseEnter={reduceMotion ? undefined : heading.onEnter}
						onMouseLeave={reduceMotion ? undefined : heading.onLeave}
						className="max-w-lg text-[clamp(2rem,7vw,3.5rem)] font-black leading-[0.98] tracking-[-0.03em] text-ink [text-wrap:balance]"
					>
						Let&apos;s build{" "}
						<span className="inline-block text-signal">{reduceMotion ? "something." : heading.display}</span>
					</h2>
					<p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/70 sm:text-base">
						Open to full-time roles and select freelance work. Reach
						out and I&apos;ll get back to you within a day or two.
					</p>
					<CornerFrame className="mt-8 inline-block bg-ink">
						<MagneticLink
							href="/contact"
							strength={0.2}
							className="group flex items-center gap-3 bg-ink py-2.5 pl-5 pr-2.5 font-mono text-sm uppercase tracking-[0.04em] text-paper transition-transform duration-150 active:scale-[0.97]"
						>
							Get in touch
							<span className="flex h-7 w-7 items-center justify-center bg-signal text-ink transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
								<ArrowUpRight className="h-4 w-4" strokeWidth={2} />
							</span>
						</MagneticLink>
					</CornerFrame>
				</div>

				<div className="flex items-center gap-3">
					{socials.map(({ icon: Icon, href, label }) => (
						<Link
							key={label}
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={label}
							className="flex h-10 w-10 items-center justify-center border border-ink/20 text-ink/70 transition-all duration-150 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper"
						>
							<Icon className="h-4 w-4" />
						</Link>
					))}
					<Link
						href={`mailto:${profile.email}`}
						aria-label="Email"
						className="flex h-10 w-10 items-center justify-center border border-ink/20 text-ink/70 transition-all duration-150 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper"
					>
						<Mail className="h-4 w-4" />
					</Link>
				</div>
			</motion.div>

			<div className="mt-16 flex flex-col gap-4 border-t border-ink/15 pt-8 font-mono text-xs uppercase tracking-[0.04em] text-ink/50 sm:flex-row sm:items-center sm:justify-between">
				<span>© {new Date().getFullYear()} {profile.name}</span>
				<div className="flex gap-6">
					<Link href="/" className="transition-colors duration-150 hover:text-ink">
						Home
					</Link>
					<Link href="/projects" className="transition-colors duration-150 hover:text-ink">
						Work
					</Link>
					<Link href="/contact" className="transition-colors duration-150 hover:text-ink">
						Contact
					</Link>
				</div>
			</div>
		</footer>
	);
};
