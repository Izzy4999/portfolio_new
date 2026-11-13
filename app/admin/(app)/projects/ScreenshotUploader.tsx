"use client";

import type { ChangeEvent, JSX } from "react";
import Image from "next/image";

import { useUploadScreenshot } from "@/app/hooks/use-upload-screenshot";

type ScreenshotUploaderProps = {
	id: string;
	label: string;
	hint: string;
	value: string[];
	onChange: (urls: string[]) => void;
};

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp";

export const ScreenshotUploader = ({ id, label, hint, value, onChange }: ScreenshotUploaderProps): JSX.Element => {
	const { mutateAsync: uploadScreenshot, isPending } = useUploadScreenshot();

	const handleFiles = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
		const input = event.currentTarget;
		const files = Array.from(input.files ?? []);
		// Files go up one at a time so the order picked is the order shown; a failed file is reported by the hook's toast and skipped.
		const uploaded: string[] = [];
		for (const file of files) {
			const result = await uploadScreenshot(file).catch(() => null);
			if (result) uploaded.push(result.url);
		}
		if (uploaded.length > 0) onChange([...value, ...uploaded]);
		input.value = "";
	};

	return (
		<div>
			<label className="block font-mono text-xs uppercase tracking-[0.08em] text-ink/70" htmlFor={id}>
				{label}
			</label>
			<p className="mt-1 text-xs text-ink/60">{hint}</p>

			{value.length > 0 ? (
				<ul className="mt-3 flex flex-wrap gap-3">
					{value.map((url) => (
						<li key={url} className="relative h-28 w-28 border border-ink/20">
							<Image src={url} alt="" fill sizes="112px" className="object-cover object-top" />
							<button
								type="button"
								onClick={() => onChange(value.filter((item) => item !== url))}
								className="absolute inset-x-0 bottom-0 bg-paper/90 py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink"
							>
								Remove
							</button>
						</li>
					))}
				</ul>
			) : null}

			<input
				id={id}
				type="file"
				accept={ACCEPTED_TYPES}
				multiple
				disabled={isPending}
				onChange={handleFiles}
				className="mt-3 block w-full text-sm text-ink file:mr-4 file:border file:border-ink/20 file:bg-paper file:px-3 file:py-2 file:font-mono file:text-xs file:uppercase file:text-ink disabled:opacity-50"
			/>
			{isPending ? <p className="mt-2 font-mono text-xs text-ink/70">Uploading</p> : null}
		</div>
	);
};
