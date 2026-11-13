"use client";
import type { JSX } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavLink {
	href: string;
	label: string;
}

const links: NavLink[] = [
	{ href: "/admin", label: "Projects" },
	{ href: "/admin/profile", label: "Profile" },
	{ href: "/admin/capabilities", label: "Capabilities" },
];

export const AdminNav = (): JSX.Element => {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = async (): Promise<void> => {
		await fetch("/api/admin/logout", { method: "POST" });
		router.push("/admin/login");
		router.refresh();
	};

	return (
		<header className="border-b border-ink/15 bg-paper">
			<div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4 sm:py-0">
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<span className="font-mono text-sm font-medium text-ink">ADMIN_</span>
					{links.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={`font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 ${
									isActive ? "text-ink" : "text-ink/50 hover:text-ink"
								}`}
							>
								{link.label}
							</Link>
						);
					})}
				</div>
				<button
					type="button"
					onClick={handleLogout}
					className="font-mono text-xs uppercase tracking-[0.08em] text-ink/50 transition-colors duration-150 hover:text-signal"
				>
					Log out
				</button>
			</div>
		</header>
	);
};
