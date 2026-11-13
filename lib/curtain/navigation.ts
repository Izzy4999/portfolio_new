import { ADMIN_PATH_PREFIX } from "@/lib/constants";

const FILE_EXTENSION = /\.[a-z0-9]+$/i;
const PRIMARY_BUTTON = 0;
const SAME_TAB_TARGET = "_self";

/**
 * Returns the in-app path a click is about to navigate to, or null when the
 * click should be left alone: modified or non-primary clicks, new-tab links,
 * downloads and files, other origins, the admin area, and links that stay on
 * the current page (hash or query only).
 */
export const findInternalHref = (event: MouseEvent): string | null => {
	if (event.defaultPrevented || event.button !== PRIMARY_BUTTON) return null;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

	const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
	if (!(anchor instanceof HTMLAnchorElement)) return null;
	if (anchor.hasAttribute("download")) return null;
	if (anchor.target && anchor.target !== SAME_TAB_TARGET) return null;

	const url = new URL(anchor.href, window.location.href);
	if (url.origin !== window.location.origin) return null;
	if (url.pathname === window.location.pathname) return null;
	if (url.pathname.startsWith(ADMIN_PATH_PREFIX) || FILE_EXTENSION.test(url.pathname)) return null;

	return `${url.pathname}${url.search}${url.hash}`;
};
