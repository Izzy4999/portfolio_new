import { CHAT_PANEL_GAP } from "@/lib/chat-bot";
import type { BoxSize, ChatPanelAnchor } from "@/types/chat-panel";

/** Opens the panel toward whichever side of the launcher has more room. Keeping it on screen is left to the CSS clamp on the panel. */
export const getChatPanelAnchor = (launcher: DOMRect, panel: BoxSize, viewport: BoxSize): ChatPanelAnchor => {
	const opensAbove = launcher.top + launcher.height / 2 > viewport.height / 2;
	const alignsRight = launcher.left + launcher.width / 2 > viewport.width / 2;

	return {
		x: alignsRight ? launcher.right - panel.width : launcher.left,
		y: opensAbove ? launcher.top - CHAT_PANEL_GAP - panel.height : launcher.bottom + CHAT_PANEL_GAP,
		origin: `${opensAbove ? "bottom" : "top"} ${alignsRight ? "right" : "left"}`,
	};
};
