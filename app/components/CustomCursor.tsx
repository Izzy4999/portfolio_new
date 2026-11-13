"use client";
import { type JSX, useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export const CustomCursor = (): JSX.Element | null => {
	const reduceMotion = useReducedMotion();
	const [enabled, setEnabled] = useState(false);
	const [hovering, setHovering] = useState(false);
	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const ringX = useSpring(x, { stiffness: 300, damping: 28 });
	const ringY = useSpring(y, { stiffness: 300, damping: 28 });

	useEffect(() => {
		const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
		setEnabled(canHover);
		if (!canHover) return;

		const handleMove = (event: MouseEvent): void => {
			x.set(event.clientX);
			y.set(event.clientY);
			const target = event.target as HTMLElement;
			setHovering(Boolean(target.closest("a, button, [role='button']")));
		};
		window.addEventListener("mousemove", handleMove);
		return () => window.removeEventListener("mousemove", handleMove);
	}, [x, y]);

	if (!enabled || reduceMotion) return null;

	return (
		<>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none fixed left-0 top-0 z-[95] h-1.5 w-1.5 rounded-full bg-signal"
				style={{ x, y, translateX: "-50%", translateY: "-50%" }}
			/>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none fixed left-0 top-0 z-[95] rounded-full border border-ink/40"
				style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
				animate={{ width: hovering ? 44 : 28, height: hovering ? 44 : 28, opacity: hovering ? 1 : 0.6 }}
				transition={{ duration: 0.2 }}
			/>
		</>
	);
};
