"use client";
import type { JSX } from "react";
import { usePathname } from "next/navigation";

import { useCurtainPlays } from "@/app/hooks/use-curtain-plays";
import { ADMIN_PATH_PREFIX } from "@/lib/constants";

import { CurtainStage } from "./CurtainStage";

/**
 * The cloth curtain for every public page: it opens on a full load, and
 * closes then opens when the visitor moves to another page. Each play gets
 * its own key, so the stage remounts and runs from the start.
 */
export const CurtainIntro = (): JSX.Element | null => {
	const pathname = usePathname();
	const { play, hasRouteArrived, handleClosed, handleDone } = useCurtainPlays(pathname);

	// pathname is null only while a pages-router route is pre-rendering
	if (!play || pathname?.startsWith(ADMIN_PATH_PREFIX)) return null;

	return (
		<CurtainStage
			key={play.id}
			kind={play.kind}
			hasRouteArrived={hasRouteArrived}
			onClosed={handleClosed}
			onDone={handleDone}
		/>
	);
};
