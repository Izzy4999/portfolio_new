import type { JSX } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ROUTES } from "@/lib/site";
import type { Project } from "@/types/project";

import { ProjectCover } from "./ProjectCover";
import { SILK_BACKGROUND, type SilkTone } from "./silk-tones";

type ProjectCardProps = {
	project: Project;
	tone: SilkTone;
	showImage?: boolean;
};

export const ProjectCard = ({ project, tone, showImage = false }: ProjectCardProps): JSX.Element => {
	const cover = showImage ? project.images[0] : undefined;

	return (
		<Link
			href={`${ROUTES.work}/${project.slug}`}
			className="group relative flex h-full overflow-hidden rounded-sm border border-indigo/30 bg-white transition-[border-color,transform] duration-200 ease-out-strong hover:border-indigo active:scale-[0.99]"
		>
			<div className="relative z-10 flex min-w-0 flex-1 flex-col gap-4 p-6">
				{cover ? (
					<ProjectCover src={cover} alt="" className="-mx-6 -mt-6 mb-2 h-64 border-b border-indigo/20" />
				) : null}
				<h3 className="text-sm font-medium uppercase leading-snug tracking-[0.2em] text-indigo [text-wrap:balance]">
					{project.shortTitle}
				</h3>
				<p className="text-[0.9375rem] leading-relaxed text-indigo/85">{project.summary}</p>
				<span className="caps mt-auto flex items-center gap-4 pt-2 text-indigo">
					View project
					<ArrowRight
						size={18}
						strokeWidth={1.25}
						aria-hidden="true"
						className="transition-transform duration-200 ease-out-strong group-hover:translate-x-1.5"
					/>
				</span>
			</div>
			<div aria-hidden="true" className="relative w-[14%] shrink-0">
				<div
					className={`absolute inset-0 origin-right transition-transform duration-500 ease-out-strong group-hover:scale-x-[1.6] ${SILK_BACKGROUND[tone]}`}
				/>
			</div>
		</Link>
	);
};
