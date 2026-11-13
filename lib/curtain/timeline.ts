import { CURTAIN_TRANSITION } from "./constants";

const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);
const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount;

/** Open amount (1 = stacked off screen, 0 = shut) while the curtain is being drawn closed. */
export const closingAmount = (seconds: number): number =>
	1 - easeInOutCubic(clamp01(seconds / CURTAIN_TRANSITION.CLOSE_SECONDS));

/** Open amount `sinceOpen` seconds into an opening pull that starts after `openAt` and lasts `travelSeconds`. */
export const openingAmount = (sinceOpen: number, openAt: number, travelSeconds: number): number =>
	easeInOutCubic(clamp01((sinceOpen - openAt) / travelSeconds));
