import type { JSX } from "react";
import type { Metadata } from "next";

import { getAllProjects } from "@/lib/projects";

import { ProjectCard } from "../components/canopy/ProjectCard";
import { ProjectRow } from "../components/canopy/ProjectRow";
import { SilkCanopy } from "../components/canopy/SilkCanopy";
import { toneAt } from "../components/canopy/silk-tones";

export const metadata: Metadata = {
	title: "Work",
	description: "Products Favour Israel Taiwo has built for the web and for phones.",
};

// Pages re-read the database at most once a minute, so /admin changes appear without a redeploy.
export const revalidate = 60;

const ProjectsPage = async (): Promise<JSX.Element> => {
	const projects = await getAllProjects();
	const withScreens = projects.filter((project) => project.images.length > 0);
	const withoutScreens = projects.filter((project) => project.images.length === 0);

	return (
		<>
			<header className="relative overflow-hidden border-b border-indigo/40 px-6 pb-12 pt-40 lg:px-12 lg:pt-48">
				<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-sky to-cloud" />
				<SilkCanopy className="absolute inset-x-0 top-0 h-64 max-lg:-left-[30%] lg:left-[20%]" />
				<div className="relative z-10">
					<h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light uppercase leading-[1.1] tracking-[0.16em] text-indigo">
						Work
					</h1>
					<p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-indigo">
						{projects.length} products, some built at work and some on my own time. Web apps, mobile apps, and the
						backends behind them.
					</p>
				</div>
			</header>

			{projects.length === 0 ? <p className="p-6 text-lg text-indigo lg:p-12">No projects are published yet.</p> : null}

			{withScreens.length > 0 ? (
				<ul className="grid gap-5 p-6 sm:grid-cols-2 lg:p-12 xl:grid-cols-3">
					{withScreens.map((project, index) => (
						<li key={project.slug}>
							<ProjectCard project={project} tone={toneAt(index)} showImage />
						</li>
					))}
				</ul>
			) : null}

			{withoutScreens.length > 0 ? (
				<section aria-labelledby="more-work-heading" className="border-t border-indigo/40 px-6 py-10 lg:px-12 lg:py-14">
					<h2 id="more-work-heading" className="caps mb-4 text-indigo">
						More work
					</h2>
					<ul className="divide-y divide-indigo/25">
						{withoutScreens.map((project) => (
							<li key={project.slug}>
								<ProjectRow project={project} />
							</li>
						))}
					</ul>
				</section>
			) : null}
		</>
	);
};

export default ProjectsPage;
