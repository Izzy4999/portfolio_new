"use client";

import type { JSX, SyntheticEvent } from "react";
import { useState } from "react";
import Image from "next/image";

type ProjectCoverProps = {
	src: string;
	alt: string;
	className?: string;
};

const FRAME_SHADOW = "shadow-[0_24px_48px_-24px_rgba(43,47,127,0.55)]";

export const ProjectCover = ({ src, alt, className }: ProjectCoverProps): JSX.Element => {
	// Write-ups mix phone and desktop screenshots; the frame is chosen once the file reports its shape.
	const [isPortrait, setIsPortrait] = useState(false);

	const handleLoad = (event: SyntheticEvent<HTMLImageElement>): void => {
		const { naturalHeight, naturalWidth } = event.currentTarget;
		setIsPortrait(naturalHeight > naturalWidth);
	};

	// Phone shots sit in a phone frame cropped from the top; desktop shots are shown at full width so nothing is cut off.
	const frameClass = isPortrait
		? `bottom-[-18%] left-1/2 top-5 aspect-[9/19] -translate-x-1/2 overflow-hidden rounded-[1.1rem] border-4 border-indigo bg-white ${FRAME_SHADOW}`
		: "inset-x-5 bottom-4 top-6";
	const imageClass = isPortrait ? "object-cover object-top" : "object-contain object-top drop-shadow-[0_18px_22px_rgba(43,47,127,0.3)]";

	return (
		<div className={`relative overflow-hidden bg-gradient-to-b from-sky to-cloud ${className ?? ""}`}>
			<div className={`absolute ${frameClass}`}>
				<Image
					src={src}
					alt={alt}
					fill
					sizes="(min-width: 1024px) 28vw, 90vw"
					onLoad={handleLoad}
					className={imageClass}
				/>
			</div>
		</div>
	);
};
