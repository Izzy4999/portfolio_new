"use client";
import { type JSX, type MouseEvent as ReactMouseEvent, useId } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const BLOB_COUNT = 5;

const GooeyBlobs = (): JSX.Element => {
	const filterId = useId();
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const spring1 = { x: useSpring(mouseX, { stiffness: 300, damping: 24 }), y: useSpring(mouseY, { stiffness: 300, damping: 24 }) };
	const spring2 = { x: useSpring(mouseX, { stiffness: 200, damping: 22 }), y: useSpring(mouseY, { stiffness: 200, damping: 22 }) };
	const spring3 = { x: useSpring(mouseX, { stiffness: 140, damping: 20 }), y: useSpring(mouseY, { stiffness: 140, damping: 20 }) };
	const spring4 = { x: useSpring(mouseX, { stiffness: 90, damping: 18 }), y: useSpring(mouseY, { stiffness: 90, damping: 18 }) };
	const spring5 = { x: useSpring(mouseX, { stiffness: 60, damping: 16 }), y: useSpring(mouseY, { stiffness: 60, damping: 16 }) };
	const blobs = [spring1, spring2, spring3, spring4, spring5];

	const handleMouseMove = (event: ReactMouseEvent<HTMLElement>): void => {
		const rect = event.currentTarget.getBoundingClientRect();
		mouseX.set(event.clientX - rect.left);
		mouseY.set(event.clientY - rect.top);
	};

	return (
		<div
			onMouseMove={handleMouseMove}
			className="relative h-full w-full cursor-crosshair overflow-hidden"
		>
			<svg aria-hidden="true" className="absolute h-0 w-0">
				<filter id={filterId}>
					<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
					<feColorMatrix
						in="blur"
						mode="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
					/>
				</filter>
			</svg>
			<div style={{ filter: `url(#${filterId})` }} className="absolute inset-0">
				{blobs.map((blob, i) => (
					<motion.div
						key={i}
						style={{ x: blob.x, y: blob.y }}
						className="absolute left-0 top-0 rounded-full bg-signal"
						initial={false}
						animate={{
							width: BLOB_COUNT * 8 - i * 10,
							height: BLOB_COUNT * 8 - i * 10,
							marginLeft: -(BLOB_COUNT * 4 - i * 5),
							marginTop: -(BLOB_COUNT * 4 - i * 5),
						}}
					/>
				))}
			</div>
		</div>
	);
};

export const LabSection = (): JSX.Element => {
	const reduceMotion = useReducedMotion();

	return (
		<section className="mx-auto max-w-6xl border-b border-ink/15 px-6 py-20 lg:px-8 sm:py-28">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.4 }}
				transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
			>
				<span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/30">
					FIG.04 / LAB
				</span>
				<h2 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">
					Pointer playground
				</h2>
				<p className="mt-2 max-w-md text-sm text-ink/50">
					No purpose. Just move your cursor over the frame.
				</p>
			</motion.div>

			<div className="mt-10 border border-ink/15 bg-black">
				<div className="h-[280px] sm:h-[360px]">
					{reduceMotion ? (
						<div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.1em] text-ink/40">
							Motion reduced - lab disabled
						</div>
					) : (
						<GooeyBlobs />
					)}
				</div>
			</div>
		</section>
	);
};
