"use client";

import type { JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Profile } from "@prisma/client";
import { profileSchema, type ProfileInput } from "@/schemas/admin";

interface ProfileFormProps {
	profile: Profile;
}

export const ProfileForm = ({ profile }: ProfileFormProps): JSX.Element => {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);
	const [saved, setSaved] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ProfileInput>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: profile.name,
			role: profile.role,
			bio: profile.bio,
			availability: profile.availability,
			email: profile.email,
			github: profile.github ?? "",
			linkedin: profile.linkedin ?? "",
			resumeUrl: profile.resumeUrl ?? "",
		},
	});

	const onSubmit = async (data: ProfileInput): Promise<void> => {
		setServerError(null);
		setSaved(false);

		const res = await fetch("/api/admin/profile", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const body = await res.json().catch(() => null);
			setServerError(body?.message ?? "Something went wrong");
			return;
		}

		setSaved(true);
		router.refresh();
	};

	const inputClass =
		"mt-2 w-full border border-ink/20 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink";
	const labelClass = "block font-mono text-xs uppercase tracking-[0.08em] text-ink/70";

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label className={labelClass} htmlFor="name">
						Name
					</label>
					<input id="name" className={inputClass} {...register("name")} />
					{errors.name ? (
						<p className="mt-2 text-xs text-signal">{errors.name.message}</p>
					) : null}
				</div>
				<div>
					<label className={labelClass} htmlFor="role">
						Role
					</label>
					<input id="role" className={inputClass} {...register("role")} />
					{errors.role ? (
						<p className="mt-2 text-xs text-signal">{errors.role.message}</p>
					) : null}
				</div>
			</div>

			<div>
				<label className={labelClass} htmlFor="bio">
					Bio (hero subtext)
				</label>
				<textarea id="bio" rows={3} className={inputClass} {...register("bio")} />
				{errors.bio ? (
					<p className="mt-2 text-xs text-signal">{errors.bio.message}</p>
				) : null}
			</div>

			<div>
				<label className={labelClass} htmlFor="email">
					Email
				</label>
				<input id="email" className={inputClass} {...register("email")} />
				{errors.email ? (
					<p className="mt-2 text-xs text-signal">{errors.email.message}</p>
				) : null}
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div>
					<label className={labelClass} htmlFor="github">
						GitHub URL
					</label>
					<input id="github" className={inputClass} {...register("github")} />
					{errors.github ? (
						<p className="mt-2 text-xs text-signal">{errors.github.message}</p>
					) : null}
				</div>
				<div>
					<label className={labelClass} htmlFor="linkedin">
						LinkedIn URL
					</label>
					<input id="linkedin" className={inputClass} {...register("linkedin")} />
					{errors.linkedin ? (
						<p className="mt-2 text-xs text-signal">{errors.linkedin.message}</p>
					) : null}
				</div>
			</div>

			<div>
				<label className={labelClass} htmlFor="resumeUrl">
					Resume URL
				</label>
				<input id="resumeUrl" className={inputClass} {...register("resumeUrl")} />
				{errors.resumeUrl ? (
					<p className="mt-2 text-xs text-signal">{errors.resumeUrl.message}</p>
				) : null}
			</div>

			<label className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink/70">
				<input type="checkbox" {...register("availability")} />
				Available for new projects
			</label>

			{serverError ? <p className="text-xs text-signal">{serverError}</p> : null}
			{saved ? <p className="text-xs text-ink/60">Saved.</p> : null}

			<button
				type="submit"
				disabled={isSubmitting}
				className="bg-ink px-6 py-2.5 font-mono text-sm uppercase tracking-[0.04em] text-paper transition-opacity duration-150 disabled:opacity-50"
			>
				{isSubmitting ? "Saving..." : "Save changes"}
			</button>
		</form>
	);
};
