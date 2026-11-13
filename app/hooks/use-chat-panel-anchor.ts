"use client";
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

import { getChatPanelAnchor } from "@/util/chat-panel-anchor";

interface UseChatPanelAnchorResult {
	launcherRef: RefObject<HTMLButtonElement | null>;
	panelRef: RefObject<HTMLDivElement | null>;
	/** Sets --chat-x, --chat-y and --chat-origin, which the panel's lg: classes read */
	panelStyle: CSSProperties | undefined;
	updateAnchor: () => void;
}

export const useChatPanelAnchor = (isOpen: boolean): UseChatPanelAnchorResult => {
	const launcherRef = useRef<HTMLButtonElement | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [panelStyle, setPanelStyle] = useState<CSSProperties>();

	const updateAnchor = useCallback((): void => {
		const launcher = launcherRef.current;
		const panel = panelRef.current;
		if (!launcher || !panel) return;

		const anchor = getChatPanelAnchor(
			launcher.getBoundingClientRect(),
			{ width: panel.offsetWidth, height: panel.offsetHeight },
			{ width: window.innerWidth, height: window.innerHeight },
		);
		setPanelStyle({
			"--chat-x": `${anchor.x}px`,
			"--chat-y": `${anchor.y}px`,
			"--chat-origin": anchor.origin,
		} as CSSProperties);
	}, []);

	// Layout effect so the panel is already in place on the frame it becomes visible
	useLayoutEffect(() => {
		if (isOpen) updateAnchor();
	}, [isOpen, updateAnchor]);

	return { launcherRef, panelRef, panelStyle, updateAnchor };
};
