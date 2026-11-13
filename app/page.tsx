import type { JSX } from "react";
import Link from "next/link";

import { buildHeroSlides } from "@/lib/hero-slides";
import { getAllProjects } from "@/lib/projects";
import { CHAT_STARTERS, CTA, HOME_PROJECTS, ROUTES, SITE, STACK } from "@/lib/site";
import type { Project } from "@/types/project";

import { ChatTrigger } from "./components/canopy/ChatTrigger";
import { DeviceScreens } from "./components/canopy/DeviceScreens";
import { ProjectCard } from "./components/canopy/ProjectCard";
import { ProjectCover } from "./components/canopy/ProjectCover";
import { SilkCanopy } from "./components/canopy/SilkCanopy";
import { SiteShell } from "./components/canopy/SiteShell";
import { SocialLinks } from "./components/canopy/SocialLinks";
import { toneAt } from "./components/canopy/silk-tones";

const PANEL_HEADING_CLASS = "caps mb-6 border-b border-indigo/40 pb-4 text-indigo";

// Pages re-read the database at most once a minute, so /admin changes appear without a redeploy.
export const revalidate = 60;

const Home = async (): Promise<JSX.Element> => {
	const projects = await getAllProjects();
	const bySlug = (slug: string): Project | undefined => projects.find((project) => project.slug === slug);

	const heroSlides = buildHeroSlides(projects, HOME_PROJECTS.heroMobile);
	const featured = projects.find((project) => project.isFeatured) ?? bySlug(HOME_PROJECTS.featured) ?? projects[0];
	// getAllProjects returns newest first, so these are the latest projects after the featured one.
	const cards = projects.filter((project) => project !== featured).slice(0, HOME_PROJECTS.cardCount);

	return (
		<SiteShell>
			<section
				aria-labelledby="hero-name"
				className="relative overflow-hidden lg:-ml-52 lg:h-[min(76dvh,740px)] lg:min-h-[600px]"
			>
				<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-sky to-cloud lg:left-[40%]" />

				<div className="relative z-10 grid h-full lg:grid-cols-[46%_1fr]">
					<div className="flex flex-col justify-end px-6 pb-8 pt-52 lg:justify-center lg:bg-cloud lg:rounded-br-[2.5rem] lg:pb-0 lg:pl-60 lg:pt-20 lg:shadow-[18px_18px_60px_-34px_rgba(43,47,127,0.45)]">
						<h1
							id="hero-name"
							className="text-[clamp(2.5rem,4.8vw,4.75rem)] font-light uppercase leading-[1.1] tracking-[0.12em] text-indigo"
						>
							Favour
							<br />
							Israel
							<br />
							Taiwo
						</h1>
					</div>

					<div className="grid items-end gap-10 px-6 pb-10 pt-6 lg:grid-cols-[1.9fr_1fr] lg:pl-8 lg:pr-12 lg:pb-12 lg:pt-0">
						<div>
							<DeviceScreens slides={heroSlides} priority />
						</div>
						<div className="lg:pb-6">
							<p className="max-w-[26ch] text-lg leading-relaxed tracking-wide text-indigo">{SITE.tagline}</p>
							<div className="mt-7 flex flex-col gap-3">
								<Link href={ROUTES.work} className="btn btn-primary">
									{CTA.work}
								</Link>
								<Link href={ROUTES.contact} className="btn btn-secondary">
									{CTA.contact}
								</Link>
							</div>
						</div>
					</div>
				</div>

				<SilkCanopy className="absolute inset-x-0 top-0 z-20 h-64 max-lg:-left-[30%] lg:left-[13%] lg:h-[60%]" />
			</section>

			<section aria-labelledby="featured-heading" className="border-t border-indigo/40 lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.4fr)]">
				<div className="flex flex-col border-b border-indigo/40 p-6 lg:border-b-0 lg:border-r lg:p-10">
					<h2 id="featured-heading" className={PANEL_HEADING_CLASS}>
						Featured work
					</h2>
					<div className="grid flex-1 gap-8 sm:grid-cols-2 sm:items-center">
						{featured.images[0] ? (
							<ProjectCover src={featured.images[0]} alt={`${featured.shortTitle} screen`} className="h-80 rounded-sm border border-indigo/30 lg:h-full lg:min-h-[22rem]" />
						) : null}
						<div>
							<h3 className="text-base font-medium uppercase tracking-[0.3em] text-indigo">{featured.shortTitle}</h3>
							<p className="mt-4 leading-relaxed text-indigo/85">{featured.summary}</p>
							<Link href={`${ROUTES.work}/${featured.slug}`} className="arrow-link mt-8">
								View project
							</Link>
						</div>
					</div>
				</div>
				<ul className="grid content-start gap-4 p-6 lg:p-8">
					{cards.map((project, index) => (
						<li key={project.slug}>
							<ProjectCard project={project} tone={toneAt(index)} />
						</li>
					))}
				</ul>
			</section>

			<div className="border-t border-indigo/40 lg:grid lg:grid-cols-[1.2fr_1fr_1fr]">
				<section aria-labelledby="stack-heading" className="border-b border-indigo/40 p-6 lg:border-b-0 lg:border-r lg:p-10">
					<h2 id="stack-heading" className={PANEL_HEADING_CLASS}>
						What I build with
					</h2>
					<dl className="grid gap-5">
						{STACK.map((row) => (
							<div key={row.area} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4">
								<dt className="caps text-indigo">{row.area}</dt>
								<dd className="leading-relaxed text-indigo/85">{row.tools}</dd>
							</div>
						))}
					</dl>
				</section>

				<section aria-labelledby="chat-heading" className="border-b border-indigo/40 p-6 lg:border-b-0 lg:border-r lg:p-10">
					<h2 id="chat-heading" className={PANEL_HEADING_CLASS}>
						{CTA.chat}
					</h2>
					<p className="leading-relaxed text-indigo/85">It answers from my real projects. Pick a question to start.</p>
					<ul className="mt-6 grid gap-3">
						{CHAT_STARTERS.map((question) => (
							<li key={question}>
								<ChatTrigger
									question={question}
									className="w-full rounded-sm border border-indigo/30 bg-white px-4 py-3 text-left text-[0.9375rem] leading-snug text-indigo transition-[border-color,transform] duration-200 ease-out-strong hover:border-indigo active:scale-[0.98]"
								>
									{question}
								</ChatTrigger>
							</li>
						))}
					</ul>
				</section>

				<section aria-labelledby="reach-heading" className="p-6 lg:p-10">
					<h2 id="reach-heading" className={PANEL_HEADING_CLASS}>
						Reach me
					</h2>
					<p className="leading-relaxed text-indigo/85">Hiring, or need a product built? Email is fastest.</p>
					<a
						href={`mailto:${SITE.email}`}
						className="mt-5 block [overflow-wrap:anywhere] text-lg tracking-wide text-indigo underline-offset-4 hover:underline"
					>
						{SITE.email}
					</a>
					<SocialLinks className="mt-8 flex gap-8" />
				</section>
			</div>
		</SiteShell>
	);
};

export default Home;
