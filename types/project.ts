export type Project = {
	slug: string;
	title: string;
	shortTitle: string;
	description: string;
	summary: string;
	date: string;
	url: string | null;
	repository: string | null;
	images: string[];
	webScreen: string | null;
	mobileScreen: string | null;
	isFeatured: boolean;
	body: string;
};

export type HeroSlide = {
	slug: string;
	title: string;
	web: string | null;
	mobile: string | null;
};
