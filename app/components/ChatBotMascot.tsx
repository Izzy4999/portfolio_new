import type { JSX } from "react";

import { CHAT_BOT_STROKE_WIDTH, CHAT_BOT_VIEWBOX } from "@/lib/chat-bot";

type ChatBotMascotProps = {
	isHeadOnly?: boolean;
	className?: string;
};

export const ChatBotMascot = ({ isHeadOnly = false, className }: ChatBotMascotProps): JSX.Element => {
	const height = isHeadOnly ? CHAT_BOT_VIEWBOX.headHeight : CHAT_BOT_VIEWBOX.height;

	return (
		<svg viewBox={`0 0 ${CHAT_BOT_VIEWBOX.width} ${height}`} aria-hidden="true" className={className}>
			<g className="stroke-indigo" strokeWidth={CHAT_BOT_STROKE_WIDTH} strokeLinejoin="round">
				{/* painted back to front: ears, limbs, body, scarf, helmet */}
				<circle cx="8" cy="24" r="5.5" className="fill-madder" />
				<circle cx="56" cy="24" r="5.5" className="fill-madder" />
				<rect x="10" y="48" width="8" height="14" rx="4" className="fill-white" />
				<rect x="46" y="48" width="8" height="14" rx="4" className="fill-white" />
				<rect x="21" y="64" width="9" height="9" rx="3.5" className="fill-white" />
				<rect x="34" y="64" width="9" height="9" rx="3.5" className="fill-white" />
				<rect x="19" y="45" width="26" height="22" rx="9" className="fill-white" />
				<rect x="20" y="40" width="24" height="8" rx="4" className="fill-madder" />
				<rect x="8" y="4" width="48" height="38" rx="17" className="fill-white" />
			</g>
			<rect x="14" y="11" width="36" height="24" rx="11" className="fill-indigo-deep" />
			<path
				d="M20 18q3-3.5 8-4"
				fill="none"
				strokeWidth="2"
				strokeLinecap="round"
				className="stroke-white/25"
			/>
			<g className="chat-bot-eyes fill-saffron">
				<rect x="23" y="18" width="5" height="10" rx="2.5" />
				<rect x="36" y="18" width="5" height="10" rx="2.5" />
			</g>
			<circle cx="32" cy="57" r="2.5" className="fill-saffron" />
		</svg>
	);
};
