"use client";
import { type JSX, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, GitFork, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "@prisma/client";
import { CornerFrame } from "@/app/components/CornerFrame";

const pad = (n: number): string => String(n).padStart(2, "0");

interface ProjectDossierProps {
	project: Project | null;
	index: number;
	total: number;
	onClose: () => void;
}

const formatDate = (date: Date | null): string => {
	if (!date) return "Ongoing";
	return Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
};

export const ProjectDossier = ({
	project,
	index,
	total,
	onClose,
}: ProjectDossierProps): JSX.Element => {
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (!project) return;
		document.body.style.overflow = "hidden";
		const handleKey = (event: KeyboardEvent): void => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKey);
		};
	}, [project, onClose]);

	return (
		<AnimatePresence>
			{project ? (
				<motion.div
					role="dialog"
					aria-modal="true"
					aria-label={`${project.title} case file`}
					className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-paper/70 p-4 backdrop-blur-sm sm:p-8"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					onClick={(event) => {
						if (event.target === event.currentTarget) onClose();
					}}
				>
					<motion.div
						layoutId={reduceMotion ? undefined : `project-card-${project.slug}`}
						initial={reduceMotion ? { opacity: 0 } : undefined}
						animate={reduceMotion ? { opacity: 1 } : undefined}
						exit={reduceMotion ? { opacity: 0 } : undefined}
						transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
						className="relative mx-auto my-auto w-full max-w-3xl bg-paper"
					>
						<CornerFrame className="bg-ink/15">
							<div className="relative bg-paper p-6 sm:p-10">
								<button
									type="button"
									onClick={onClose}
									aria-label="Close case file"
									className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-ink/20 text-ink/60 transition-colors duration-150 hover:border-ink hover:bg-ink hover:text-paper sm:right-6 sm:top-6"
								>
									<X className="h-4 w-4" strokeWidth={2} />
								</button>

								<div className="flex items-center justify-between gap-2 pr-12">
									<span className="font-mono text-xs uppercase tracking-[0.08em] text-ink/50">
										{formatDate(project.publishedAt)}
									</span>
									<span className="font-mono text-xs text-signal">
										{pad(index)} / {pad(total)}
									</span>
								</div>

								{project.coverImage ? (
									<motion.div
										layoutId={reduceMotion ? undefined : `project-image-${project.slug}`}
										className="relative mt-6 aspect-[16/9] w-full overflow-hidden border border-ink/10"
									>
										<Image
											src={project.coverImage}
											alt=""
											fill
											sizes="(min-width: 768px) 720px, 100vw"
											className="object-cover"
										/>
									</motion.div>
								) : null}

								<h2 className="mt-6 text-3xl font-black leading-[0.98] tracking-tight text-ink sm:text-4xl">
									{project.title}
								</h2>
								<p className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base">
									{project.description}
								</p>

								{project.techStack.length > 0 ? (
									<div className="mt-6 flex flex-wrap gap-2">
										{project.techStack.map((tech) => (
											<span
												key={tech}
												className="border border-ink/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/60"
											>
												{tech}
											</span>
										))}
									</div>
								) : null}

								<div className="mt-8 flex flex-wrap items-center gap-3">
									<Link
										href={`/projects/${project.slug}`}
										className="group inline-flex items-center gap-2 bg-ink py-2.5 pl-5 pr-3 font-mono text-sm uppercase tracking-[0.04em] text-paper transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-6 active:scale-[0.97]"
									>
										Full case study
										<ArrowUpRight
											className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
											strokeWidth={2}
										/>
									</Link>
									{project.url ? (
										<Link
											href={project.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 border border-ink/30 px-5 py-2.5 font-mono text-sm uppercase tracking-[0.04em] text-ink transition-colors duration-150 hover:border-ink hover:bg-ink hover:text-paper active:scale-[0.97]"
										>
											Live site
										</Link>
									) : null}
									{project.repository ? (
										<Link
											href={project.repository}
											target="_blank"
											rel="noopener noreferrer"
											aria-label="Source code"
											className="flex h-10 w-10 items-center justify-center border border-ink/20 text-ink/70 transition-colors duration-150 hover:border-ink hover:bg-ink hover:text-paper"
										>
											<GitFork className="h-4 w-4" />
										</Link>
									) : null}
								</div>
							</div>
						</CornerFrame>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};
