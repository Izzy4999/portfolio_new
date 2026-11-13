"use client";

import { useRef, type JSX, type MouseEvent as ReactMouseEvent, type Ref } from "react";
import { motion } from "framer-motion";

import { CHAT_LAUNCHER_MOTION } from "@/lib/chat-bot";

import { ChatBotMascot } from "./ChatBotMascot";

type ChatLauncherProps = {
	isOpen: boolean;
	onToggle: () => void;
	/** Fires when a drag ends, so the chat panel can follow */
	onMoved: () => void;
	ref: Ref<HTMLButtonElement>;
};

export const ChatLauncher = ({ isOpen, onToggle, onMoved, ref }: ChatLauncherProps): JSX.Element => {
	const boundsRef = useRef<HTMLDivElement>(null);
	const wasDraggedRef = useRef(false);

	const handlePointerDown = (): void => {
		wasDraggedRef.current = false;
	};

	const handleDragStart = (): void => {
		wasDraggedRef.current = true;
	};

	// Releasing a drag still fires a click. Keyboard clicks have detail 0 and always toggle.
	const handleClick = (event: ReactMouseEvent<HTMLButtonElement>): void => {
		if (event.detail > 0 && wasDraggedRef.current) return;
		onToggle();
	};

	return (
		<div ref={boundsRef} className="pointer-events-none fixed inset-3 z-50 max-lg:hidden">
			<motion.button
				ref={ref}
				type="button"
				drag
				dragConstraints={boundsRef}
				dragElastic={CHAT_LAUNCHER_MOTION.dragElastic}
				dragMomentum={false}
				whileHover={CHAT_LAUNCHER_MOTION.hover}
				whileTap={CHAT_LAUNCHER_MOTION.tap}
				whileDrag={CHAT_LAUNCHER_MOTION.drag}
				onPointerDown={handlePointerDown}
				onDragStart={handleDragStart}
				onDragEnd={onMoved}
				onClick={handleClick}
				aria-label={isOpen ? "Close chat" : "Open chat"}
				aria-expanded={isOpen}
				title="Chat with Favour's AI. Drag to move."
				className="pointer-events-auto absolute bottom-2 right-2 cursor-grab touch-none rounded-sm active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
			>
				<span className="chat-bot-alive block">
					<ChatBotMascot className="h-auto w-16 drop-shadow-[0_10px_10px_rgba(43,47,127,0.35)]" />
				</span>
			</motion.button>
		</div>
	);
};
