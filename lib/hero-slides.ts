import type { HeroSlide, Project } from "@/types/project";

const toSlide = (project: Project, fallbackMobileSlug: string): HeroSlide => ({
	slug: project.slug,
	title: project.shortTitle,
	web: project.webScreen,
	mobile: project.mobileScreen ?? (project.slug === fallbackMobileSlug ? project.images[0] ?? null : null),
});

export const buildHeroSlides = (projects: Project[], fallbackMobileSlug: string): HeroSlide[] =>
	projects.map((project) => toSlide(project, fallbackMobileSlug)).filter((slide) => slide.web || slide.mobile);
