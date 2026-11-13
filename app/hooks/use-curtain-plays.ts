"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { CURTAIN_KIND, REDUCED_MOTION_QUERY } from "@/lib/curtain/constants";
import { findInternalHref } from "@/lib/curtain/navigation";
import type { CurtainPlay, UseCurtainPlaysResult } from "@/types/curtain";

const FIRST_LOAD_PLAY: CurtainPlay = { id: 0, kind: CURTAIN_KIND.OPEN };

/**
 * Decides when the curtain plays and which way.
 * - Full page load: opens.
 * - Click on an in-app link: closes over the current page, switches page, opens.
 * - Any other page change (back/forward, router.push from code): opens, because
 *   those cannot be held back while a curtain closes.
 */
export const useCurtainPlays = (pathname: string | null): UseCurtainPlaysResult => {
	const router = useRouter();
	const [play, setPlay] = useState<CurtainPlay | null>(FIRST_LOAD_PLAY);
	const lastPlayId = useRef(FIRST_LOAD_PLAY.id);
	const previousPathname = useRef(pathname);
	const isPlaying = useRef(true);

	useEffect(() => {
		isPlaying.current = play !== null;
	}, [play]);

	useEffect(() => {
		const handleClick = (event: MouseEvent): void => {
			// while a curtain is already moving, let the click behave normally
			if (isPlaying.current || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
			const href = findInternalHref(event);
			if (!href) return;
			event.preventDefault();
			lastPlayId.current += 1;
			isPlaying.current = true;
			setPlay({
				id: lastPlayId.current,
				kind: CURTAIN_KIND.CLOSE_THEN_OPEN,
				href,
				fromPathname: window.location.pathname,
			});
		};
		// capture phase, so this runs before next/link starts its own navigation
		document.addEventListener("click", handleClick, true);
		return () => document.removeEventListener("click", handleClick, true);
	}, []);

	// layout effect: the curtain has to cover the new page before it is painted
	useLayoutEffect(() => {
		if (previousPathname.current === pathname) return;
		previousPathname.current = pathname;
		if (isPlaying.current) return;
		lastPlayId.current += 1;
		isPlaying.current = true;
		setPlay({ id: lastPlayId.current, kind: CURTAIN_KIND.OPEN });
	}, [pathname]);

	const handleClosed = (): void => {
		if (play?.kind === CURTAIN_KIND.CLOSE_THEN_OPEN) router.push(play.href);
	};

	const handleDone = (): void => setPlay(null);

	const hasRouteArrived = play?.kind === CURTAIN_KIND.CLOSE_THEN_OPEN && pathname !== play.fromPathname;

	return { play, hasRouteArrived, handleClosed, handleDone };
};
