"use client";
import { useEffect, useRef, useState } from "react";

import {
	CLOTH,
	CURTAIN_KIND,
	CURTAIN_TIMELINE,
	CURTAIN_TRANSITION,
	MAX_FRAME_SECONDS,
	REDUCED_MOTION_QUERY,
} from "@/lib/curtain/constants";
import { createCurtainRenderer } from "@/lib/curtain/renderer";
import { hasSeenName, markNameSeen } from "@/lib/curtain/session";
import { closingAmount, openingAmount } from "@/lib/curtain/timeline";
import type { CurtainPhase, CurtainRenderer, CurtainStageProps, UseCurtainIntroResult } from "@/types/curtain";

const startRenderer = (canvas: HTMLCanvasElement): CurtainRenderer | null => {
	try {
		return createCurtainRenderer(canvas);
	} catch (error: unknown) {
		console.error("Curtain could not start, showing the page without it", error);
		return null;
	}
};

/**
 * Plays the cloth curtain once per mount.
 * - "open": starts shut and opens. The name is part of the first play of a visit only.
 * - "close-then-open": draws shut over the current page, calls onClosed so the
 *   page can change, waits for the new page, then opens on it.
 */
export const useCurtainIntro = ({
	kind,
	hasRouteArrived,
	onClosed,
	onDone,
}: CurtainStageProps): UseCurtainIntroResult => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [phase, setPhase] = useState<CurtainPhase>("pending");
	const [shouldShowName, setShouldShowName] = useState(false);
	const [isCovered, setIsCovered] = useState(false);

	// the frame loop outlives renders, so it reads the latest props through a ref
	const latest = useRef({ hasRouteArrived, onClosed, onDone });
	useEffect(() => {
		latest.current = { hasRouteArrived, onClosed, onDone };
	});

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const isTransition = kind === CURTAIN_KIND.CLOSE_THEN_OPEN;
		const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
		const renderer = prefersReducedMotion ? null : startRenderer(canvas);
		if (!renderer) {
			// no curtain to draw: the page change must still happen
			if (isTransition) latest.current.onClosed();
			latest.current.onDone();
			return;
		}

		const isFirstPlay = !isTransition && !hasSeenName();
		const pull = isTransition ? CURTAIN_TRANSITION : CURTAIN_TIMELINE;
		const openSeconds = isFirstPlay ? CURTAIN_TIMELINE.END_AT : pull.CLEAR_AT;

		// when the opening pull starts: at once on a first load, after the page change otherwise
		let openingFrom: number | null = isTransition ? null : 0;
		let hasNavigated = false;
		let hasCovered = false;

		// draw the starting position before the CSS stand-in is removed
		renderer.reset((seconds) =>
			openingFrom === null
				? closingAmount(seconds)
				: openingAmount(seconds - openingFrom, pull.OPEN_AT, pull.TRAVEL_SECONDS),
		);
		if (isTransition) renderer.setAirDrag(CURTAIN_TRANSITION.CLOSE_AIR_DRAG);
		renderer.advanceTo(0);
		setShouldShowName(isFirstPlay);
		setPhase("playing");

		let clock = 0;
		let lastFrame = performance.now();
		let frameId = 0;
		const frame = (now: number): void => {
			clock += Math.min((now - lastFrame) / 1000, MAX_FRAME_SECONDS);
			lastFrame = now;

			if (isTransition && !hasCovered && clock >= CURTAIN_TRANSITION.COVER_AT) {
				hasCovered = true;
				setIsCovered(true);
			}
			if (isTransition && !hasNavigated && clock >= CURTAIN_TRANSITION.NAVIGATE_AT) {
				hasNavigated = true;
				latest.current.onClosed();
			}
			const hasWaitedLongEnough =
				clock >= CURTAIN_TRANSITION.NAVIGATE_AT + CURTAIN_TRANSITION.ROUTE_TIMEOUT_SECONDS;
			if (hasNavigated && openingFrom === null && (latest.current.hasRouteArrived || hasWaitedLongEnough)) {
				openingFrom = clock;
				renderer.setAirDrag(CLOTH.AIR_DRAG);
				setIsCovered(false);
			}

			renderer.advanceTo(clock);
			if (openingFrom !== null && clock >= openingFrom + openSeconds) {
				// marked at the end, not the start, so a play cut short shows the name again
				if (isFirstPlay) markNameSeen();
				renderer.releaseContext();
				latest.current.onDone();
				return;
			}
			frameId = requestAnimationFrame(frame);
		};
		frameId = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(frameId);
			renderer.dispose();
		};
	}, [kind]);

	return { canvasRef, phase, shouldShowName, isCovered };
};
