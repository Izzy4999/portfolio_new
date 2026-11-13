"use client";
import { useRef, type RefObject, type MouseEvent as ReactMouseEvent } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

interface UseMagneticResult<T extends HTMLElement> {
	ref: RefObject<T | null>;
	x: MotionValue<number>;
	y: MotionValue<number>;
	onMouseMove: (event: ReactMouseEvent<T>) => void;
	onMouseLeave: () => void;
}

const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 };

export const useMagnetic = <T extends HTMLElement>(
	strength = 0.3,
): UseMagneticResult<T> => {
	const ref = useRef<T | null>(null);
	const rawX = useMotionValue(0);
	const rawY = useMotionValue(0);
	const x = useSpring(rawX, SPRING_CONFIG);
	const y = useSpring(rawY, SPRING_CONFIG);

	const onMouseMove = (event: ReactMouseEvent<T>): void => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		rawX.set((event.clientX - rect.left - rect.width / 2) * strength);
		rawY.set((event.clientY - rect.top - rect.height / 2) * strength);
	};

	const onMouseLeave = (): void => {
		rawX.set(0);
		rawY.set(0);
	};

	return { ref, x, y, onMouseMove, onMouseLeave };
};
