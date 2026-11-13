import type { JSX } from "react";

const ITEMS = [
	"NEXT.JS",
	"REACT NATIVE",
	"TYPESCRIPT",
	"NODE.JS",
	"POSTGRESQL",
	"GO",
	"PRISMA",
	"TAILWIND",
];

export const MarqueeDivider = (): JSX.Element => {
	const track = [...ITEMS, ...ITEMS];

	return (
		<div
			aria-hidden="true"
			className="group overflow-hidden border-b border-ink/15 bg-ink py-4"
		>
			<div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
				{track.map((item, i) => (
					<div key={`${item}-${i}`} className="flex shrink-0 items-center gap-10">
						<span className="font-mono text-sm uppercase tracking-[0.2em] text-paper/50">
							{item}
						</span>
						<span className="font-mono text-sm text-signal/70" aria-hidden="true">
							/
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
