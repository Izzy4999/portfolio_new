import { NAME_SEEN_KEY, NAME_SEEN_VALUE } from "./constants";

/** False when storage is blocked, so those visitors see the name on every page. */
export const hasSeenName = (): boolean => {
	try {
		return sessionStorage.getItem(NAME_SEEN_KEY) === NAME_SEEN_VALUE;
	} catch (error: unknown) {
		console.warn("Curtain: session storage is unavailable, so the name will show on every page", error);
		return false;
	}
};

export const markNameSeen = (): void => {
	try {
		sessionStorage.setItem(NAME_SEEN_KEY, NAME_SEEN_VALUE);
	} catch (error: unknown) {
		console.warn("Curtain: could not record that the name was shown", error);
	}
};
