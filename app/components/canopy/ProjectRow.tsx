import type { JSX } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ROUTES } from "@/lib/site";
import type { Project } from "@/types/project";

export const ProjectRow = ({ project }: { project: Project }): JSX.Element => (
	<Link
		href={`${ROUTES.work}/${project.slug}`}
		className="group grid gap-3 py-6 transition-colors duration-150 hover:bg-white sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] sm:items-baseline sm:gap-8 sm:px-4"
	>
		<h3 className="text-sm font-medium uppercase leading-snug tracking-[0.2em] text-indigo">{project.shortTitle}</h3>
		<p className="leading-relaxed text-indigo/85">{project.summary}</p>
		<ArrowRight
			size={18}
			strokeWidth={1.25}
			aria-hidden="true"
			className="text-indigo transition-transform duration-200 ease-out-strong group-hover:translate-x-1.5"
		/>
	</Link>
);
