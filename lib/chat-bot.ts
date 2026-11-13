export const CHAT_BOT_VIEWBOX = {
	width: 64,
	height: 76,
	/** Crop that ends just under the helmet, used for the small avatar */
	headHeight: 44,
} as const;

export const CHAT_BOT_STROKE_WIDTH = 2.5;

/** Space between the launcher and the chat panel that opens next to it, in px */
export const CHAT_PANEL_GAP = 12;

export const CHAT_LAUNCHER_MOTION = {
	dragElastic: 0.15,
	hover: { scale: 1.06 },
	tap: { scale: 0.94 },
	drag: { scale: 1.12, rotate: -8 },
} as const;
