"use client";
import type { JSX } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@prisma/client";

interface ProjectsTableProps {
	projects: Project[];
}

export const ProjectsTable = ({ projects }: ProjectsTableProps): JSX.Element => {
	const router = useRouter();

	const handleDelete = async (id: string, title: string): Promise<void> => {
		if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
		await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
		router.refresh();
	};

	if (projects.length === 0) {
		return (
			<p className="border border-ink/15 p-8 text-center font-mono text-sm text-ink/60">
				No projects yet. Create your first one.
			</p>
		);
	}

	return (
		<div className="border border-ink/15">
			{projects.map((project) => (
				<div
					key={project.id}
					className="flex items-center justify-between gap-4 border-b border-ink/15 p-4 last:border-b-0"
				>
					<div className="min-w-0">
						<p className="truncate text-sm font-bold text-ink">{project.title}</p>
						<p className="mt-1 font-mono text-xs uppercase tracking-[0.04em] text-ink/50">
							{project.slug} · {project.published ? "Published" : "Draft"}
							{project.featured ? " · Featured" : ""}
						</p>
					</div>
					<div className="flex shrink-0 items-center gap-4 font-mono text-xs uppercase tracking-[0.08em]">
						<Link
							href={`/admin/projects/${project.id}/edit`}
							className="text-ink/70 transition-colors duration-150 hover:text-ink"
						>
							Edit
						</Link>
						<button
							type="button"
							onClick={() => handleDelete(project.id, project.title)}
							className="text-ink/70 transition-colors duration-150 hover:text-signal"
						>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
