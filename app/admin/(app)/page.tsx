import type { JSX } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectsTable } from "./ProjectsTable";

const AdminDashboardPage = async (): Promise<JSX.Element> => {
	const projects = await prisma.project.findMany({
		orderBy: [{ order: "asc" }, { createdAt: "desc" }],
	});

	return (
		<div>
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl font-black tracking-tight text-ink">Projects</h1>
				<Link
					href="/admin/projects/new"
					className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-paper"
				>
					New project
				</Link>
			</div>
			<div className="mt-8">
				<ProjectsTable projects={projects} />
			</div>
		</div>
	);
};

export default AdminDashboardPage;
