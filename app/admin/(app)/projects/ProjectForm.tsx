"use client";

import type { JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Project } from "@prisma/client";

import { screenshotSchema } from "@/schemas/admin";

import { ScreenshotUploader } from "./ScreenshotUploader";

const projectFormSchema = z.object({
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	content: z.string().min(1, "Content is required"),
	techStackInput: z.string(),
	url: z.string().url().optional().or(z.literal("")),
	repository: z.string().url().optional().or(z.literal("")),
	coverImage: z.string().url().optional().or(z.literal("")),
	webScreens: z.array(screenshotSchema),
	mobileScreens: z.array(screenshotSchema),
	featured: z.boolean(),
	published: z.boolean(),
	order: z.string(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
	project?: Project;
}

const slugify = (value: string): string =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

export const ProjectForm = ({ project }: ProjectFormProps): JSX.Element => {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		control,
		formState: { errors, isSubmitting },
	} = useForm<ProjectFormValues>({
		resolver: zodResolver(projectFormSchema),
		defaultValues: {
			slug: project?.slug ?? "",
			title: project?.title ?? "",
			description: project?.description ?? "",
			content: project?.content ?? "",
			techStackInput: project?.techStack.join(", ") ?? "",
			url: project?.url ?? "",
			repository: project?.repository ?? "",
			coverImage: project?.coverImage ?? "",
			webScreens: project?.webScreens ?? [],
			mobileScreens: project?.mobileScreens ?? [],
			featured: project?.featured ?? false,
			published: project?.published ?? true,
			order: String(project?.order ?? 0),
		},
	});

	const title = watch("title");

	const handleTitleBlur = (): void => {
		if (!project && title) {
			setValue("slug", slugify(title));
		}
	};

	const onSubmit = async (data: ProjectFormValues): Promise<void> => {
		setServerError(null);

		const payload = {
			slug: data.slug,
			title: data.title,
			description: data.description,
			content: data.content,
			techStack: data.techStackInput
				.split(",")
				.map((tech) => tech.trim())
				.filter(Boolean),
			url: data.url || undefined,
			repository: data.repository || undefined,
			coverImage: data.coverImage || undefined,
			webScreens: data.webScreens,
			mobileScreens: data.mobileScreens,
			featured: data.featured,
			published: data.published,
			order: Number(data.order) || 0,
		};

		const res = await fetch(
			project ? `/api/admin/projects/${project.id}` : "/api/admin/projects",
			{
				method: project ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			},
		);

		if (!res.ok) {
			const body = await res.json().catch(() => null);
			setServerError(body?.message ?? "Something went wrong");
			return;
		}

		router.push("/admin");
		router.refresh();
	};

	const inputClass =
		"mt-2 w-full border border-ink/20 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink";
	const labelClass = "block font-mono text-xs uppercase tracking-[0.08em] text-ink/70";

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label className={labelClass} htmlFor="title">
						Title
					</label>
					<input
						id="title"
						className={inputClass}
						{...register("title", { onBlur: handleTitleBlur })}
					/>
					{errors.title ? (
						<p className="mt-2 text-xs text-signal">{errors.title.message}</p>
					) : null}
				</div>
				<div>
					<label className={labelClass} htmlFor="slug">
						Slug
					</label>
					<input id="slug" className={inputClass} {...register("slug")} />
					{errors.slug ? (
						<p className="mt-2 text-xs text-signal">{errors.slug.message}</p>
					) : null}
				</div>
			</div>

			<div>
				<label className={labelClass} htmlFor="description">
					Description
				</label>
				<textarea
					id="description"
					rows={2}
					className={inputClass}
					{...register("description")}
				/>
				{errors.description ? (
					<p className="mt-2 text-xs text-signal">{errors.description.message}</p>
				) : null}
			</div>

			<div>
				<label className={labelClass} htmlFor="content">
					Content (markdown)
				</label>
				<textarea
					id="content"
					rows={14}
					className={`${inputClass} font-mono`}
					{...register("content")}
				/>
				{errors.content ? (
					<p className="mt-2 text-xs text-signal">{errors.content.message}</p>
				) : null}
			</div>

			<div>
				<label className={labelClass} htmlFor="techStackInput">
					Tech stack (comma-separated)
				</label>
				<input
					id="techStackInput"
					className={inputClass}
					placeholder="Next.js, TypeScript, Prisma"
					{...register("techStackInput")}
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
				<div>
					<label className={labelClass} htmlFor="url">
						Live URL
					</label>
					<input id="url" className={inputClass} {...register("url")} />
					{errors.url ? (
						<p className="mt-2 text-xs text-signal">{errors.url.message}</p>
					) : null}
				</div>
				<div>
					<label className={labelClass} htmlFor="repository">
						Repository URL
					</label>
					<input id="repository" className={inputClass} {...register("repository")} />
					{errors.repository ? (
						<p className="mt-2 text-xs text-signal">{errors.repository.message}</p>
					) : null}
				</div>
				<div>
					<label className={labelClass} htmlFor="coverImage">
						Cover image URL
					</label>
					<input id="coverImage" className={inputClass} {...register("coverImage")} />
					{errors.coverImage ? (
						<p className="mt-2 text-xs text-signal">{errors.coverImage.message}</p>
					) : null}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Controller
					control={control}
					name="webScreens"
					render={({ field }) => (
						<ScreenshotUploader
							id="webScreens"
							label="Web screenshots"
							hint="Desktop or browser shots. The first one is used as the cover."
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
				<Controller
					control={control}
					name="mobileScreens"
					render={({ field }) => (
						<ScreenshotUploader
							id="mobileScreens"
							label="Phone screenshots"
							hint="Shots from the mobile app, shown in a phone frame."
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
			</div>

			<div className="flex flex-wrap items-center gap-8">
				<div>
					<label className={labelClass} htmlFor="order">
						Order
					</label>
					<input
						id="order"
						type="number"
						className={`${inputClass} w-24`}
						{...register("order")}
					/>
				</div>
				<label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink/70">
					<input type="checkbox" {...register("featured")} />
					Featured
				</label>
				<label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink/70">
					<input type="checkbox" {...register("published")} />
					Published
				</label>
			</div>

			{serverError ? <p className="text-xs text-signal">{serverError}</p> : null}

			<button
				type="submit"
				disabled={isSubmitting}
				className="bg-ink px-6 py-2.5 font-mono text-sm uppercase tracking-[0.04em] text-paper transition-opacity duration-150 disabled:opacity-50"
			>
				{isSubmitting ? "Saving..." : project ? "Save changes" : "Create project"}
			</button>
		</form>
	);
};
