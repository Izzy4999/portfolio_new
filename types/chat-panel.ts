export interface BoxSize {
	width: number;
	height: number;
}

export interface ChatPanelAnchor {
	/** Preferred viewport position of the panel's top-left corner, in px */
	x: number;
	y: number;
	/** CSS transform-origin, the panel corner nearest the launcher */
	origin: string;
}
