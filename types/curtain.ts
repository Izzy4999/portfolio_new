import type { RefObject } from "react";

import type { CURTAIN_KIND } from "@/lib/curtain/constants";

export type CurtainKind = (typeof CURTAIN_KIND)[keyof typeof CURTAIN_KIND];

export type CurtainPhase = "pending" | "playing";

/** Maps simulation time in seconds to how open the curtain is: 0 shut, 1 stacked off screen. */
export type OpenAmountAt = (seconds: number) => number;

export interface ClothHalf {
	/** xyz per vertex, row by row from the track down */
	position: Float32Array;
	step: (openAmount: number, airDrag: number) => void;
}

export interface CurtainRenderer {
	/** hangs a fresh curtain sized to the canvas, starting at timeline(0) */
	reset: (timeline: OpenAmountAt) => void;
	/** simulates up to the given time, then draws */
	advanceTo: (seconds: number) => void;
	/** how strongly the air damps the cloth from now on; reset() restores the default */
	setAirDrag: (airDrag: number) => void;
	dispose: () => void;
	/** frees the WebGL context itself; call once the canvas is finished with */
	releaseContext: () => void;
}

export interface NameLetter {
	char: string;
	/** distance, in letters, from the middle of the full name */
	fromMiddle: number;
}

export interface NameWord {
	text: string;
	letters: NameLetter[];
}

/** One run of the curtain. A new id remounts the stage and plays it again. */
export type CurtainPlay =
	| { id: number; kind: typeof CURTAIN_KIND.OPEN }
	| { id: number; kind: typeof CURTAIN_KIND.CLOSE_THEN_OPEN; href: string; fromPathname: string };

export interface CurtainStageProps {
	kind: CurtainKind;
	/** close-then-open only: the new page has rendered behind the shut curtain */
	hasRouteArrived: boolean;
	/** close-then-open only: the curtain is shut, switch pages now */
	onClosed: () => void;
	onDone: () => void;
}

export interface UseCurtainIntroResult {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	phase: CurtainPhase;
	/** true only on the first play of a visit */
	shouldShowName: boolean;
	/** the flat cover is up, hiding the page change behind the cloth */
	isCovered: boolean;
}

export interface UseCurtainPlaysResult {
	play: CurtainPlay | null;
	hasRouteArrived: boolean;
	handleClosed: () => void;
	handleDone: () => void;
}
