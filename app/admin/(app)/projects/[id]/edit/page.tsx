import type { JSX } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../../ProjectForm";

type Props = {
	params: Promise<{ id: string }>;
};

const EditProjectPage = async ({ params }: Props): Promise<JSX.Element> => {
	const { id } = await params;
	const project = await prisma.project.findUnique({ where: { id } });

	if (!project) {
		notFound();
	}

	return (
		<div>
			<h1 className="text-2xl font-black tracking-tight text-ink">Edit project</h1>
			<div className="mt-8">
				<ProjectForm project={project} />
			</div>
		</div>
	);
};

export default EditProjectPage;
