"use client";
import { type JSX, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Capability } from "@prisma/client";
import { resolveIcon } from "@/lib/icon-map";

const pad = (n: number): string => String(n).padStart(2, "0");

interface SkillsPlaygroundProps {
	capabilities: Capability[];
}

const container: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.06 } },
};

const pill: Variants = {
	hidden: { opacity: 0, scale: 0.8 },
	show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export const SkillsPlayground = ({ capabilities }: SkillsPlaygroundProps): JSX.Element => {
	const reduceMotion = useReducedMotion();
	const boundsRef = useRef<HTMLDivElement>(null);

	return (
		<section className="mx-auto max-w-6xl border-b border-ink/15 px-6 py-20 lg:px-8 sm:py-28">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.4 }}
				transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
				className="flex items-end justify-between gap-4"
			>
				<div>
					<span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/30">
						FIG.03 / DISCIPLINES
					</span>
					<h2 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">
						What I work with
					</h2>
					<p className="mt-2 max-w-md text-sm text-ink/50">
						Drag them around. They&apos;re bouncy.
					</p>
				</div>
				<span className="hidden font-mono text-xs uppercase tracking-[0.08em] text-ink/40 sm:block">
					{pad(capabilities.length)} disciplines
				</span>
			</motion.div>

			<motion.div
				ref={boundsRef}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.2 }}
				variants={container}
				className="relative mt-10 flex min-h-[320px] flex-wrap items-center justify-center gap-4 border border-dashed border-ink/15 p-10 sm:min-h-[380px]"
			>
				{capabilities.map((capability, i) => {
					const Icon = resolveIcon(capability.icon);
					return (
						<motion.div
							key={capability.id}
							variants={pill}
							drag={!reduceMotion}
							dragConstraints={boundsRef}
							dragElastic={0.6}
							dragTransition={{ bounceStiffness: 400, bounceDamping: 18 }}
							whileDrag={{ scale: 1.08, cursor: "grabbing", zIndex: 10 }}
							whileHover={reduceMotion ? undefined : { y: -2 }}
							className="group flex cursor-grab items-center gap-2.5 border border-ink/20 bg-paper px-4 py-2.5 shadow-[2px_2px_0_rgba(244,244,242,0.1)] active:cursor-grabbing"
						>
							<span className="font-mono text-[10px] text-ink/30">{pad(i + 1)}</span>
							<Icon className="h-4 w-4 shrink-0 text-signal" strokeWidth={1.75} />
							<span className="select-none font-mono text-xs uppercase tracking-[0.04em] text-ink/80">
								{capability.label}
							</span>
						</motion.div>
					);
				})}
			</motion.div>
		</section>
	);
};
