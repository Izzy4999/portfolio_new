import type { Project as ProjectRecord } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { GITHUB_BASE_URL } from "@/lib/site";
import type { Project } from "@/types/project";

const TITLE_DESCRIPTOR_SEPARATOR = " - ";
const SLUG_STYLE_TITLE = /^[a-z0-9]+(-[a-z0-9]+)+$/;
const SENTENCE_END = /(?<=[.!?])\s/;
const ABSOLUTE_URL = /^https?:\/\//;
const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";
// The originals are multi-megabyte PNGs; asking Cloudinary for a sized, compressed copy keeps the image optimiser from timing out.
const CLOUDINARY_DELIVERY_SEGMENT = "/image/upload/f_auto,q_auto,w_1400/";
const IMAGE_PATTERN = /src="([^"]+)"|!\[[^\]]*\]\(([^)\s]+)\)/g;
// The write-ups embed screenshots as JSX; the page shows them in its own gallery instead.
const EMBED_PATTERN = /<div[\s\S]*?<\/div>|<img[\s\S]*?\/>|!\[[^\]]*\]\([^)]+\)|^\s*<\/?[a-zA-Z][^>]*>\s*$/gm;

// A few write-ups are titled with their repository slug, e.g. "fintech-app".
const toDisplayTitle = (title: string): string => {
	const name = title.split(TITLE_DESCRIPTOR_SEPARATOR)[0];
	return SLUG_STYLE_TITLE.test(name) ? name.replaceAll("-", " ") : name;
};

const extractImages = (record: ProjectRecord): string[] => {
	const embedded = Array.from(record.content.matchAll(IMAGE_PATTERN), (match) => match[1] ?? match[2]);
	const cover = record.coverImage ? [record.coverImage] : [];
	const urls = [...record.webScreens, ...record.mobileScreens, ...cover, ...embedded];
	return Array.from(new Set(urls), (url) => url.replace(CLOUDINARY_UPLOAD_SEGMENT, CLOUDINARY_DELIVERY_SEGMENT));
};

const toRepositoryUrl = (repository: string | null): string | null => {
	if (!repository) return null;
	return ABSOLUTE_URL.test(repository) ? repository : `${GITHUB_BASE_URL}${repository}`;
};

const toProject = (record: ProjectRecord): Project => ({
	slug: record.slug,
	title: record.title,
	shortTitle: toDisplayTitle(record.title),
	description: record.description,
	summary: record.description.split(SENTENCE_END)[0],
	date: (record.publishedAt ?? record.createdAt).toISOString(),
	url: record.url,
	repository: toRepositoryUrl(record.repository),
	images: extractImages(record),
	webScreen: record.webScreens[0] ?? null,
	mobileScreen: record.mobileScreens[0] ?? null,
	isFeatured: record.featured,
	body: record.content.replace(EMBED_PATTERN, "").trim(),
});

export const getAllProjects = async (): Promise<Project[]> => {
	const records = await prisma.project.findMany({
		where: { published: true },
		orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { order: "asc" }],
	});
	return records.map(toProject);
};

export const getProject = async (slug: string): Promise<Project | null> => {
	const record = await prisma.project.findFirst({ where: { slug, published: true } });
	return record ? toProject(record) : null;
};
