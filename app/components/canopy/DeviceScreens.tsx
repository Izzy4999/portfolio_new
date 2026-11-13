"use client";
import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";

import { useRotatingIndex } from "@/app/hooks/use-rotating-index";
import { HOME_PROJECTS, ROUTES } from "@/lib/site";
import type { HeroSlide } from "@/types/project";

type DeviceScreensProps = {
	slides: HeroSlide[];
	priority?: boolean;
};

type ScreenFrameProps = {
	slides: HeroSlide[];
	pickScreen: (slide: HeroSlide) => string | null;
	activeIndex: number;
	frameClassName: string;
	imageClassName: string;
	sizes: string;
	missingLabel: string;
	priority: boolean;
};

const FRAME_SHADOW = "shadow-[0_30px_60px_-28px_rgba(43,47,127,0.55)]";
const CROSSFADE = "transition-opacity duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none";
const MISSING_LABEL = { web: "No desktop view", mobile: "No mobile view" } as const;
const EMPTY_LABEL = "Screenshots to come";

const pickWeb = (slide: HeroSlide): string | null => slide.web;
const pickMobile = (slide: HeroSlide): string | null => slide.mobile;

const MissingSlot = ({ label, className }: { label: string; className: string }): JSX.Element => (
	<div className={`absolute inset-0 flex items-center justify-center bg-sky/60 p-3 text-center ${className}`}>
		<span className="caps leading-relaxed text-indigo">{label}</span>
	</div>
);

const ScreenFrame = ({ slides, pickScreen, activeIndex, frameClassName, imageClassName, sizes, missingLabel, priority }: ScreenFrameProps): JSX.Element => {
	const active = slides[activeIndex];

	return (
		<Link
			href={`${ROUTES.work}/${active.slug}`}
			aria-label={`Open ${active.title}`}
			className={`${frameClassName} block transition-colors duration-200 hover:border-indigo focus-visible:border-indigo`}
		>
			{slides.map((slide, index) => {
				const screen = pickScreen(slide);
				const visibility = `${CROSSFADE} ${index === activeIndex ? "opacity-100" : "opacity-0"}`;
				return screen ? (
					<Image
						key={slide.slug}
						src={screen}
						alt={`${slide.title} screen`}
						aria-hidden={index !== activeIndex}
						fill
						priority={priority && index === 0}
						sizes={sizes}
						className={`${imageClassName} ${visibility}`}
					/>
				) : (
					<MissingSlot key={slide.slug} label={missingLabel} className={visibility} />
				);
			})}
		</Link>
	);
};

export const DeviceScreens = ({ slides, priority = false }: DeviceScreensProps): JSX.Element => {
	const { index, setIsPaused } = useRotatingIndex(slides.length, HOME_PROJECTS.rotateMs);
	const active = slides[index];

	if (!active) {
		return (
			<div className={`flex aspect-[16/10] items-center justify-center rounded-sm border border-indigo/30 bg-sky/60 ${FRAME_SHADOW}`}>
				<span className="caps text-indigo">{EMPTY_LABEL}</span>
			</div>
		);
	}

	return (
		<div
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onFocus={() => setIsPaused(true)}
			onBlur={() => setIsPaused(false)}
		>
			<div className="relative pb-6 pr-[16%]">
				<ScreenFrame
					slides={slides}
					pickScreen={pickWeb}
					activeIndex={index}
					frameClassName={`relative aspect-[16/10] overflow-hidden rounded-sm border border-indigo/30 bg-white ${FRAME_SHADOW}`}
					imageClassName="origin-bottom-left scale-[1.12] object-cover object-left-top"
					sizes="(min-width: 1024px) 38vw, 80vw"
					missingLabel={MISSING_LABEL.web}
					priority={priority}
				/>
				<div className="absolute bottom-0 right-0 w-[27%]">
					<ScreenFrame
						slides={slides}
						pickScreen={pickMobile}
						activeIndex={index}
						frameClassName={`relative aspect-[9/19] overflow-hidden rounded-[1.1rem] border-4 border-indigo bg-white ${FRAME_SHADOW}`}
						imageClassName="object-cover object-top"
						sizes="(min-width: 1024px) 9vw, 24vw"
						missingLabel={MISSING_LABEL.mobile}
						priority={priority}
					/>
				</div>
			</div>
			<p className="caps mt-6 text-indigo">
				<Link href={`${ROUTES.work}/${active.slug}`} className="underline-offset-8 hover:underline">
					{active.title}
				</Link>
			</p>
		</div>
	);
};
