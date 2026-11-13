import type { JSX } from "react";

type LogoMarkProps = {
	className?: string;
	cursorClassName?: string;
};

// FIT: F and T hang from one bar, the I is a text cursor. Ink follows the parent's text colour.
export const LogoMark = ({ className, cursorClassName = "fill-madder" }: LogoMarkProps): JSX.Element => (
	<svg viewBox="8 14 48 36" className={className} aria-hidden="true">
		<path d="M8 17H56M11 14V50M8 32H24M47 14V50" fill="none" stroke="currentColor" strokeWidth="6" />
		<rect className={`logo-cursor ${cursorClassName}`} x="29" y="25" width="6" height="25" />
	</svg>
);
