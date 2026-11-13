import type { JSX, ReactNode } from "react";

interface CornerFrameProps {
	children: ReactNode;
	className?: string;
	tickClassName?: string;
}

export const CornerFrame = ({
	children,
	className = "",
	tickClassName = "border-signal",
}: CornerFrameProps): JSX.Element => {
	const tick = `absolute h-2.5 w-2.5 border-2 ${tickClassName}`;

	return (
		<div className={`relative ${className}`}>
			<span aria-hidden="true" className={`${tick} -top-px -left-px border-r-0 border-b-0`} />
			<span aria-hidden="true" className={`${tick} -top-px -right-px border-l-0 border-b-0`} />
			<span aria-hidden="true" className={`${tick} -bottom-px -left-px border-r-0 border-t-0`} />
			<span aria-hidden="true" className={`${tick} -bottom-px -right-px border-l-0 border-t-0`} />
			{children}
		</div>
	);
};
