import type { JSX } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/app/components/nav";

interface HeaderProps {
	project: {
		url?: string | null;
		title: string;
		description: string;
		repository?: string | null;
	};
	views: number;
}

export const Header = ({ project, views }: HeaderProps): JSX.Element => {
	const links: { label: string; href: string }[] = [];
	if (project.repository) {
		links.push({ label: "GitHub", href: project.repository });
	}
	if (project.url) {
		links.push({ label: "Website", href: project.url });
	}

	return (
		<header className="border-b border-ink/15 bg-paper">
			<Navigation />
			<div className="mx-auto max-w-3xl px-6 py-16 lg:px-8 sm:py-24">
				<div className="flex items-center justify-between gap-2">
					<span className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.08em] text-ink/50">
						<Eye className="h-4 w-4" />{" "}
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
					</span>
				</div>
				<h1 className="mt-4 max-w-3xl text-[clamp(2rem,6vw,3.5rem)] font-black leading-[0.98] tracking-[-0.03em] text-ink [text-wrap:balance]">
					{project.title}
				</h1>
				<p className="mt-6 text-lg leading-8 text-ink/70">
					{project.description}
				</p>
				{links.length > 0 ? (
					<div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 font-mono text-sm uppercase tracking-[0.04em]">
						{links.map((link) => (
							<Link
								key={link.label}
								target="_blank"
								rel="noopener noreferrer"
								href={link.href}
								className="text-ink transition-colors duration-150 hover:text-signal"
							>
								{link.label} <span aria-hidden="true">&rarr;</span>
							</Link>
						))}
					</div>
				) : null}
			</div>
		</header>
	);
};
