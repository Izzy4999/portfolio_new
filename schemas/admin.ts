import { z } from "zod";

export const loginSchema = z.object({
	password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// A screenshot is either a full link (uploads) or a file in /public (e.g. "/projects/aisha-web.png").
export const screenshotSchema = z
	.string()
	.refine((value) => value.startsWith("/") || URL.canParse(value), "Use a full link or a site path");

export const projectSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	content: z.string().min(1, "Content is required"),
	techStack: z.array(z.string()).default([]),
	url: z.string().url().optional().or(z.literal("")),
	repository: z.string().url().optional().or(z.literal("")),
	coverImage: z.string().url().optional().or(z.literal("")),
	webScreens: z.array(screenshotSchema).default([]),
	mobileScreens: z.array(screenshotSchema).default([]),
	featured: z.boolean().default(false),
	published: z.boolean().default(true),
	order: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const capabilitySchema = z.object({
	label: z.string().min(1, "Label is required"),
	icon: z.string().min(1, "Icon is required"),
	order: z.number().int().default(0),
});

export type CapabilityInput = z.infer<typeof capabilitySchema>;

export const profileSchema = z.object({
	name: z.string().min(1, "Name is required"),
	role: z.string().min(1, "Role is required"),
	bio: z.string().min(1, "Bio is required"),
	availability: z.boolean(),
	email: z.string().email("Enter a valid email"),
	github: z.string().url().optional().or(z.literal("")),
	linkedin: z.string().url().optional().or(z.literal("")),
	resumeUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
