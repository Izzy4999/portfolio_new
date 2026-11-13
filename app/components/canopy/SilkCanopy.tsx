"use client";

import type { JSX } from "react";
import { useEffect, useId } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const VIEW_BOX = "0 0 1000 400";
const POINTER_SPRING = { stiffness: 40, damping: 14 } as const;
const POINTER_LEAN_PX = 28;

// Paths run past the view box on every open side so drift and lean never expose a cut edge.
const BAND_PATHS = {
	indigo: "M150,-80 L1140,-80 L1140,96 C820,150 450,128 150,-80 Z",
	madder: "M-140,-80 L260,-80 C520,60 800,150 1140,172 L1140,252 C760,250 400,150 -140,-80 Z",
	saffron: "M560,-80 L700,-80 C760,90 900,200 1140,216 L1140,300 C860,300 650,150 560,-80 Z",
} as const;

const SILK = { indigo: "#2b2f7f", madder: "#b23a65", saffron: "#f2b31a" } as const;
// Where two bands cross, the overlap is painted in the chord colour instead of relying on a blend mode.
const CHORD = { indigoSaffron: "#5b4a72", indigoMadder: "#6a3d8f", madderSaffron: "#8a4a28" } as const;
const SILK_OPACITY = 0.94;

export const SilkCanopy = ({ className }: { className?: string }): JSX.Element => {
	const id = useId();
	const shouldReduceMotion = useReducedMotion();
	const pointer = useMotionValue(0);
	const pointerX = useSpring(pointer, POINTER_SPRING);
	const lean = useTransform(pointerX, (value) => `translate3d(${value * POINTER_LEAN_PX}px, 0, 0)`);

	useEffect(() => {
		if (shouldReduceMotion) return;
		const onPointerMove = (event: PointerEvent): void => {
			pointer.set(event.clientX / window.innerWidth - 0.5);
		};
		window.addEventListener("pointermove", onPointerMove, { passive: true });
		return () => window.removeEventListener("pointermove", onPointerMove);
	}, [pointer, shouldReduceMotion]);

	return (
		<motion.div aria-hidden="true" className={`pointer-events-none ${className ?? ""}`} style={{ transform: lean }}>
			<svg viewBox={VIEW_BOX} preserveAspectRatio="none" className="silk-band h-full w-full overflow-visible">
				<defs>
					<clipPath id={`${id}-indigo`}>
						<path d={BAND_PATHS.indigo} />
					</clipPath>
					<clipPath id={`${id}-saffron`}>
						<path d={BAND_PATHS.saffron} />
					</clipPath>
					<linearGradient id={`${id}-fold`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
						<stop offset="0" stopColor="#1f2263" stopOpacity="0" />
						<stop offset="0.55" stopColor="#1f2263" stopOpacity="0.12" />
						<stop offset="1" stopColor="#1f2263" stopOpacity="0" />
					</linearGradient>
				</defs>
				<g fillOpacity={SILK_OPACITY}>
					<path d={BAND_PATHS.saffron} fill={SILK.saffron} />
					<path d={BAND_PATHS.indigo} fill={SILK.indigo} />
					<path d={BAND_PATHS.saffron} fill={CHORD.indigoSaffron} clipPath={`url(#${id}-indigo)`} />
					<path d={BAND_PATHS.madder} fill={SILK.madder} />
					<path d={BAND_PATHS.madder} fill={CHORD.madderSaffron} clipPath={`url(#${id}-saffron)`} />
					<path d={BAND_PATHS.madder} fill={CHORD.indigoMadder} clipPath={`url(#${id}-indigo)`} />
				</g>
				<path d={BAND_PATHS.madder} fill={`url(#${id}-fold)`} />
				<path d={BAND_PATHS.saffron} fill={`url(#${id}-fold)`} />
			</svg>
		</motion.div>
	);
};
