import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { prisma } from "../lib/prisma";

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

interface ProjectFrontmatter {
	title: string;
	description: string;
	date?: string;
	url?: string;
	repository?: string;
	published?: boolean;
}

const seedProjects = async (): Promise<void> => {
	const files = readdirSync(PROJECTS_DIR).filter((file) => file.endsWith(".mdx"));

	for (let index = 0; index < files.length; index++) {
		const file = files[index];
		const slug = file.replace(/\.mdx$/, "");
		const raw = readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
		const { data, content } = matter(raw);
		const frontmatter = data as ProjectFrontmatter;

		await prisma.project.upsert({
			where: { slug },
			create: {
				slug,
				title: frontmatter.title,
				description: frontmatter.description,
				content: content.trim(),
				url: frontmatter.url,
				repository: frontmatter.repository,
				published: frontmatter.published ?? true,
				publishedAt: frontmatter.date ? new Date(frontmatter.date) : null,
				order: index,
			},
			update: {
				title: frontmatter.title,
				description: frontmatter.description,
				content: content.trim(),
				url: frontmatter.url,
				repository: frontmatter.repository,
				published: frontmatter.published ?? true,
				publishedAt: frontmatter.date ? new Date(frontmatter.date) : null,
			},
		});
	}

	console.log(`Seeded ${files.length} projects`);
};

const seedProfile = async (): Promise<void> => {
	const existing = await prisma.profile.findFirst();
	if (existing) {
		console.log("Profile already exists, skipping");
		return;
	}

	await prisma.profile.create({
		data: {
			name: "Favour Israel Taiwo",
			role: "Software Engineer",
			bio: "Software engineer building fast, reliable web and mobile products, from fintech dashboards to survey platforms and EMRs.",
			availability: true,
			email: "favour.israel.taiwo@outlook.com",
			github: "https://github.com/Izzy4999",
			linkedin: "https://www.linkedin.com/in/favour-taiwo-8b9b5a200",
		},
	});
	console.log("Seeded profile");
};

const seedCapabilities = async (): Promise<void> => {
	const count = await prisma.capability.count();
	if (count > 0) {
		console.log("Capabilities already exist, skipping");
		return;
	}

	const capabilities = [
		{ label: "Next.js & React", icon: "Boxes" },
		{ label: "React Native (Expo)", icon: "Smartphone" },
		{ label: "Node.js & Go", icon: "Server" },
		{ label: "PostgreSQL & Prisma", icon: "Database" },
		{ label: "Tailwind & Chakra UI", icon: "Palette" },
		{ label: "Vercel & AWS", icon: "Cloud" },
	];

	await prisma.capability.createMany({
		data: capabilities.map((capability, order) => ({ ...capability, order })),
	});
	console.log(`Seeded ${capabilities.length} capabilities`);
};

const main = async (): Promise<void> => {
	await seedProjects();
	await seedProfile();
	await seedCapabilities();
};

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
