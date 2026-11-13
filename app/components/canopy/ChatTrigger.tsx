"use client";

import type { JSX, ReactNode } from "react";

import { CHAT_OPEN_EVENT } from "@/lib/site";
import type { ChatOpenDetail } from "@/types/contact";

type ChatTriggerProps = {
	children: ReactNode;
	className?: string;
	question?: string;
};

export const ChatTrigger = ({ children, className, question }: ChatTriggerProps): JSX.Element => {
	const openChat = (): void => {
		window.dispatchEvent(new CustomEvent<ChatOpenDetail>(CHAT_OPEN_EVENT, { detail: { question } }));
	};

	return (
		<button type="button" onClick={openChat} className={className}>
			{children}
		</button>
	);
};
