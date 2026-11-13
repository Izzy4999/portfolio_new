"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Sun } from "lucide-react";

import { LOCAL_TIME_REFRESH_MS, SITE } from "@/lib/site";

const formatLocalTime = (): string =>
	new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: SITE.timeZone }).format(new Date());

export const LocalTime = (): JSX.Element => {
	// Starts empty so the server and first client render match; the clock fills in on mount.
	const [time, setTime] = useState("");

	useEffect(() => {
		setTime(formatLocalTime());
		const timer = window.setInterval(() => setTime(formatLocalTime()), LOCAL_TIME_REFRESH_MS);
		return () => window.clearInterval(timer);
	}, []);

	return (
		<p className="flex items-center gap-4 text-indigo">
			<Sun size={26} strokeWidth={1} aria-hidden="true" />
			<span className="caps flex flex-col gap-2">
				<span>{SITE.city}</span>
				<span className="tabular-nums">{time} local</span>
			</span>
		</p>
	);
};
