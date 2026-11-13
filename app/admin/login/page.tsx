"use client";

import type { JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas/admin";

const AdminLoginPage = (): JSX.Element => {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginInput): Promise<void> => {
		setServerError(null);
		const res = await fetch("/api/admin/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const body = await res.json().catch(() => null);
			setServerError(body?.message ?? "Something went wrong");
			return;
		}

		router.push("/admin");
		router.refresh();
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-paper px-6">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-sm border border-ink/15 p-8"
			>
				<h1 className="text-xl font-black tracking-tight text-ink">Admin login</h1>
				<div className="mt-6">
					<label
						htmlFor="password"
						className="block font-mono text-xs uppercase tracking-[0.08em] text-ink/70"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						autoFocus
						className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
						{...register("password")}
					/>
					{errors.password ? (
						<p className="mt-2 text-xs text-signal">{errors.password.message}</p>
					) : null}
				</div>

				{serverError ? (
					<p className="mt-4 text-xs text-signal">{serverError}</p>
				) : null}

				<button
					type="submit"
					disabled={isSubmitting}
					className="mt-6 w-full bg-ink py-2.5 font-mono text-sm uppercase tracking-[0.04em] text-paper transition-opacity duration-150 disabled:opacity-50"
				>
					{isSubmitting ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</div>
	);
};

export default AdminLoginPage;
