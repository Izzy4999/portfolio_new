"use client";
import type { JSX, ReactNode } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMagnetic } from "@/app/hooks/use-magnetic";

interface MagneticLinkProps {
	href: string;
	className: string;
	children: ReactNode;
	strength?: number;
}

export const MagneticLink = ({
	href,
	className,
	children,
	strength = 0.25,
}: MagneticLinkProps): JSX.Element => {
	const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLDivElement>(strength);

	return (
		<motion.div
			ref={ref}
			onMouseMove={onMouseMove}
			onMouseLeave={onMouseLeave}
			style={{ x, y }}
			className="inline-flex"
		>
			<Link href={href} className={className}>
				{children}
			</Link>
		</motion.div>
	);
};
