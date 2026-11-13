"use client";
import { type JSX, type MouseEvent as ReactMouseEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
	type Variants,
} from "framer-motion";
import type { Project } from "@prisma/client";
import { ProjectDossier } from "@/app/components/ProjectDossier";

const pad = (n: number): string => String(n).padStart(2, "0");

interface WorkShowcaseProps {
	projects: Project[];
}

const formatDate = (date: Date | null): string => {
	if (!date) return "Ongoing";
	return Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

const reveal: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface TiltCardProps {
	project: Project;
	index: number;
	total: number;
	onOpen: () => void;
}

const TiltCard = ({ project, index, total, onOpen }: TiltCardProps): JSX.Element => {
	const reduceMotion = useReducedMotion();
	const rawX = useMotionValue(0);
	const rawY = useMotionValue(0);
	const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), {
		stiffness: 200,
		damping: 20,
	});
	const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), {
		stiffness: 200,
		damping: 20,
	});

	const handleMouseMove = (event: ReactMouseEvent<HTMLElement>): void => {
		if (reduceMotion) return;
		const rect = event.currentTarget.getBoundingClientRect();
		rawX.set((event.clientX - rect.left) / rect.width - 0.5);
		rawY.set((event.clientY - rect.top) / rect.height - 0.5);
	};

	const handleMouseLeave = (): void => {
		rawX.set(0);
		rawY.set(0);
	};

	return (
		<motion.div variants={reveal} style={{ perspective: 1200 }}>
			<motion.button
				type="button"
				layoutId={reduceMotion ? undefined : `project-card-${project.slug}`}
				onClick={onOpen}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
				className="group relative flex h-full w-full flex-col overflow-hidden border border-ink/15 bg-paper p-6 text-left transition-colors duration-150 hover:border-ink sm:p-8"
			>
				{project.coverImage ? (
					<motion.div
						layoutId={reduceMotion ? undefined : `project-image-${project.slug}`}
						style={{ transform: "translateZ(30px)" }}
						className="relative mb-5 aspect-[16/10] w-full overflow-hidden border border-ink/10"
					>
						<Image
							src={project.coverImage}
							alt=""
							fill
							sizes="(min-width: 1024px) 33vw, 100vw"
							className="object-cover grayscale transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
						/>
					</motion.div>
				) : null}
				<div style={{ transform: "translateZ(20px)" }} className="flex items-center justify-between gap-2">
					<span className="font-mono text-xs uppercase tracking-[0.08em] text-ink/50">
						{formatDate(project.publishedAt)}
					</span>
					<span className="font-mono text-xs text-signal">
						{pad(index + 1)} / {pad(total)}
					</span>
				</div>
				<h3 style={{ transform: "translateZ(20px)" }} className="mt-3 text-xl font-bold tracking-tight text-ink sm:text-2xl">
					{project.title}
				</h3>
				<p style={{ transform: "translateZ(20px)" }} className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">
					{project.description}
				</p>
				<span
					style={{ transform: "translateZ(20px)" }}
					className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink"
				>
					Open case file
					<ArrowUpRight
						className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						strokeWidth={2}
					/>
				</span>
			</motion.button>
		</motion.div>
	);
};

export const WorkShowcase = ({ projects }: WorkShowcaseProps): JSX.Element => {
	const [openSlug, setOpenSlug] = useState<string | null>(null);
	const openProject = projects.find((project) => project.slug === openSlug) ?? null;
	const openIndex = projects.findIndex((project) => project.slug === openSlug);

	return (
		<section className="mx-auto max-w-6xl border-b border-ink/15 px-6 py-20 lg:px-8 sm:py-28">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.4 }}
				transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
				className="mb-12 flex items-end justify-between gap-4"
			>
				<div>
					<span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/30">
						FIG.02 / WORK
					</span>
					<h2 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">
						Selected work
					</h2>
				</div>
				<Link
					href="/projects"
					className="hidden shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-ink/60 transition-colors duration-150 hover:text-signal sm:block"
				>
					View all work
				</Link>
			</motion.div>

			<motion.div
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.15 }}
				variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
				className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
			>
				{projects.map((project, i) => (
					<TiltCard
						key={project.slug}
						project={project}
						index={i}
						total={projects.length}
						onOpen={() => setOpenSlug(project.slug)}
					/>
				))}
			</motion.div>

			<Link
				href="/projects"
				className="mt-8 inline-flex font-mono text-xs uppercase tracking-[0.08em] text-ink/60 transition-colors duration-150 hover:text-signal sm:hidden"
			>
				View all work
			</Link>

			<ProjectDossier
				project={openProject}
				index={openIndex + 1}
				total={projects.length}
				onClose={() => setOpenSlug(null)}
			/>
		</section>
	);
};
