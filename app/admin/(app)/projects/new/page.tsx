import type { JSX } from "react";
import { ProjectForm } from "../ProjectForm";

const NewProjectPage = (): JSX.Element => {
	return (
		<div>
			<h1 className="text-2xl font-black tracking-tight text-ink">New project</h1>
			<div className="mt-8">
				<ProjectForm />
			</div>
		</div>
	);
};

export default NewProjectPage;
