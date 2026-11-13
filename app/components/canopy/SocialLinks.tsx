import type { JSX } from "react";

import { SOCIALS } from "@/lib/site";

export const SocialLinks = ({ className }: { className?: string }): JSX.Element => (
	<ul className={className}>
		{SOCIALS.map((social) => (
			<li key={social.label}>
				<a
					href={social.href}
					target="_blank"
					rel="noopener noreferrer"
					className="caps text-indigo underline-offset-8 hover:underline"
				>
					{social.label}
				</a>
			</li>
		))}
	</ul>
);
