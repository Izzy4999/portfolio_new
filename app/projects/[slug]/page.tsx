import type { JSX } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { getAllProjects, getProject } from "@/lib/projects";
import { CTA, ROUTES } from "@/lib/site";

import { SilkCanopy } from "../../components/canopy/SilkCanopy";

import { ReportView } from "./view";

type Props = {
	params: Promise<{ slug: string }>;
};

const formatDate = (date: string): string =>
	new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(date));

// Pages re-read the database at most once a minute, so /admin changes appear without a redeploy.
export const revalidate = 60;

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
	const projects = await getAllProjects();
	return projects.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const { slug } = await params;
	const project = await getProject(slug);
	return project ? { title: project.title, description: project.description } : {};
};

const ProjectPage = async ({ params }: Props): Promise<JSX.Element> => {
	const { slug } = await params;
	const project = await getProject(slug);

	if (!project) {
		notFound();
	}

	return (
		<article>
			<ReportView slug={project.slug} />

			<header className="relative overflow-hidden border-b border-indigo/40 px-6 pb-12 pt-40 lg:px-12 lg:pt-48">
				<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-sky to-cloud" />
				<SilkCanopy className="absolute inset-x-0 top-0 h-64 max-lg:-left-[30%] lg:left-[20%]" />
				<div className="relative z-10">
				<Link href={ROUTES.work} className="arrow-link">
					All work
				</Link>
				<h1 className="mt-8 max-w-[22ch] text-[clamp(2rem,4.2vw,3.75rem)] font-light uppercase leading-[1.12] tracking-[0.12em] text-indigo [text-wrap:balance]">
					{project.shortTitle}
				</h1>
				<p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-indigo">{project.description}</p>
				<div className="mt-8 flex flex-wrap items-center gap-4">
					{project.url ? (
						<a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
							Open live site
						</a>
					) : null}
					{project.repository ? (
						<a href={project.repository} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
							View code
						</a>
					) : null}
					<span className="caps text-indigo">{formatDate(project.date)}</span>
				</div>
				</div>
			</header>

			{project.images.length > 0 ? (
				<ul className="flex gap-5 overflow-x-auto border-b border-indigo/40 bg-gradient-to-b from-sky to-cloud p-6 lg:p-12">
					{project.images.map((image, index) => (
						<li key={image} className="shrink-0">
							{/* Screens are a mix of phone and desktop shots, so height is fixed and width follows the file. */}
							<Image
								src={image}
								alt={`${project.title} screen ${index + 1}`}
								width={1200}
								height={800}
								sizes="(min-width: 1024px) 50vw, 85vw"
								className="h-[22rem] w-auto rounded-sm border border-indigo/30 bg-white shadow-[0_30px_60px_-28px_rgba(43,47,127,0.55)] lg:h-[28rem]"
							/>
						</li>
					))}
				</ul>
			) : (
				<p className="caps border-b border-indigo/40 bg-sky/50 px-6 py-10 leading-relaxed text-indigo lg:px-12">
					Screenshots to come
				</p>
			)}

			<div className="prose max-w-[70ch] px-6 py-12 text-indigo prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-[0.14em] prose-headings:text-indigo prose-a:text-madder prose-strong:text-indigo prose-li:marker:text-indigo lg:px-12 lg:py-16">
				<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
					{project.body}
				</ReactMarkdown>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-6 border-t border-indigo/40 px-6 py-10 lg:px-12">
				<p className="text-lg text-indigo">Need something like this built?</p>
				<Link href={ROUTES.contact} className="btn btn-primary">
					{CTA.contact}
				</Link>
			</div>
		</article>
	);
};

export default ProjectPage;
