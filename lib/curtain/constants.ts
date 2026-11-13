export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)" as const;

/** sessionStorage flag: the name has already been shown during this visit. */
export const NAME_SEEN_KEY = "pf-curtain-name-seen" as const;
export const NAME_SEEN_VALUE = "1" as const;

export const CURTAIN_KIND = {
	/** full page load: the curtain starts shut and opens */
	OPEN: "open",
	/** moving between pages: it closes over the old page, then opens on the new one */
	CLOSE_THEN_OPEN: "close-then-open",
} as const;

/** First-load play. Seconds from the moment the curtain starts playing. */
export const CURTAIN_TIMELINE = {
	OPEN_AT: 0.3,
	TRAVEL_SECONDS: 2.1,
	NAME_AT: 0.9,
	/** the cloth is off screen: the name backdrop starts fading here */
	FADE_AT: 2,
	/** end of a play that shows the name */
	END_AT: 2.65,
	/** end of a play without the name: the swinging hem has cleared too */
	CLEAR_AT: 2.2,
} as const;

/** Page-to-page play. A quicker pull, since visitors see it on every click. */
export const CURTAIN_TRANSITION = {
	CLOSE_SECONDS: 1.1,
	/** heavier than CLOTH.AIR_DRAG so the incoming cloth does not swing wildly */
	CLOSE_AIR_DRAG: 4,
	/** the halves have met: the flat cover starts fading in behind the still-swinging cloth */
	COVER_AT: 1.15,
	/** the cover is opaque (its fade is 250ms in global.css): switch pages here */
	NAVIGATE_AT: 1.45,
	// the next three count from the moment the new page has arrived
	OPEN_AT: 0.1,
	TRAVEL_SECONDS: 1.6,
	CLEAR_AT: 1.75,
	/** open anyway if the new page has not arrived by then */
	ROUTE_TIMEOUT_SECONDS: 8,
} as const;

export const LETTER_STAGGER_MS = 30;

/** World units: the viewport is 2 tall and y points up. */
export const CLOTH = {
	COLUMNS: 72,
	ROWS: 28,
	/** cloth columns per fold */
	PLEAT_COLUMNS: 9,
	/** the fabric is this much wider than the opening, so it hangs in folds */
	FULLNESS: 1.6,
	/** the track sits just above the viewport */
	TOP_Y: 1.08,
	/** the hem hangs just past the bottom edge and shows when the cloth swings */
	HEM_Y: -1.05,
	// the next three are fractions of half the viewport width
	WALL_MARGIN: 0.04,
	CENTRE_OVERLAP: 0.02,
	EXIT_LEAD: 1.25,
	/** how tightly the runners bunch, relative to the cloth between them */
	STACK_PITCH: 0.2,
	GRAVITY: 18,
	AIR_DRAG: 1.2,
	SIM_STEP: 1 / 120,
	SOLVER_PASSES: 5,
	SETTLE_STEPS: 40,
	/** offsets the right half's folds so the halves are not mirror images */
	RIGHT_HALF_PHASE: 2.1,
} as const;

export const VERTICES_PER_HALF = CLOTH.COLUMNS * CLOTH.ROWS;
export const MAX_FRAME_SECONDS = 0.05;
export const MAX_PIXEL_RATIO = 2;
