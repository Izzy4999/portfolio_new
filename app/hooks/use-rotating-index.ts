"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type RotatingIndex = {
	index: number;
	setIsPaused: (isPaused: boolean) => void;
};

export const useRotatingIndex = (count: number, intervalMs: number): RotatingIndex => {
	const [index, setIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const prefersReducedMotion = useReducedMotion();
	const canRotate = count > 1 && !isPaused && !prefersReducedMotion;

	useEffect(() => {
		if (!canRotate) return;
		const timer = setInterval(() => setIndex((current) => (current + 1) % count), intervalMs);
		return () => clearInterval(timer);
	}, [canRotate, count, intervalMs]);

	return { index, setIsPaused };
};
