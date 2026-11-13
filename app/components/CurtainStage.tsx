"use client";
import type { CSSProperties, JSX } from "react";

import { useCurtainIntro } from "@/app/hooks/use-curtain-intro";
import { CURTAIN_TIMELINE, LETTER_STAGGER_MS } from "@/lib/curtain/constants";
import { buildNameWords } from "@/lib/curtain/letters";
import { SITE } from "@/lib/site";
import type { CurtainStageProps } from "@/types/curtain";

const NAME_WORDS = buildNameWords(SITE.name);

const MS_PER_SECOND = 1000;
const TIMELINE_STYLE = {
	"--curtain-name-at": `${CURTAIN_TIMELINE.NAME_AT * MS_PER_SECOND}ms`,
	"--curtain-fade-at": `${CURTAIN_TIMELINE.FADE_AT * MS_PER_SECOND}ms`,
	"--curtain-letter-stagger": `${LETTER_STAGGER_MS}ms`,
} as CSSProperties;

/**
 * One play of the cloth curtain. The first-load play is rendered on the
 * server so it covers the page from the first paint. On the first play of a
 * visit the name rises on a backdrop behind the cloth; every other play moves
 * the cloth directly over the page. Motion lives in global.css under
 * "Curtain intro".
 */
export const CurtainStage = (props: CurtainStageProps): JSX.Element => {
	const { canvasRef, phase, shouldShowName, isCovered } = useCurtainIntro(props);

	return (
		<div
			aria-hidden="true"
			data-phase={phase}
			data-kind={props.kind}
			data-name={shouldShowName ? "show" : "hide"}
			data-cover={isCovered ? "on" : "off"}
			style={TIMELINE_STYLE}
			className="curtain-intro fixed inset-0 z-[100] overflow-hidden"
		>
			<div className="curtain-scrim absolute inset-0 grid place-items-center bg-cloud">
				<p className="flex flex-col items-center gap-[0.18em] font-canopy text-[clamp(2.75rem,14vw,5rem)] font-light uppercase leading-[1.1] tracking-[0.12em] text-indigo md:flex-row md:gap-[0.55em] md:text-[clamp(3rem,5.6vw,6.5rem)]">
					{NAME_WORDS.map((word) => (
						// -mr cancels the trailing letter-space so the name stays optically centred
						<span key={word.text} className="-mr-[0.12em] inline-flex overflow-hidden py-[0.08em]">
							{word.letters.map((letter, letterIndex) => (
								<span
									// the letters of a word never reorder
									key={`${letter.char}-${letterIndex}`}
									className="curtain-letter"
									style={{ "--k": letter.fromMiddle } as CSSProperties}
								>
									{letter.char}
								</span>
							))}
						</span>
					))}
				</p>
			</div>
			<div className="curtain-cover absolute inset-0" />
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
		</div>
	);
};
