"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Navigation: React.FC = () => {
	return (
		<header className="sticky top-0 z-50 border-b border-ink/15 bg-paper/90 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-5xl flex-row-reverse items-center justify-between px-6 lg:px-8">
				<div className="flex justify-between gap-6 font-mono text-xs uppercase tracking-[0.08em]">
					<Link
						href="/projects"
						className="relative text-ink/60 transition-colors duration-150 hover:text-signal"
					>
						Work
					</Link>
					<Link
						href="/contact"
						className="relative text-ink/60 transition-colors duration-150 hover:text-signal"
					>
						Contact
					</Link>
				</div>

				<Link
					href="/"
					className="flex h-8 w-8 items-center justify-center border border-ink/25 text-ink/70 transition-colors duration-150 hover:border-signal hover:text-signal"
				>
					<ArrowLeft className="h-4 w-4" strokeWidth={2} />
				</Link>
			</div>
		</header>
	);
};
