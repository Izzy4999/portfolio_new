import { ImageResponse } from "next/og";

import { SITE, STACK } from "@/lib/site";

const COLORS = {
	cloud: "#f7f6f2",
	indigo: "#2b2f7f",
	indigoDeep: "#1f2263",
	madder: "#b23a65",
	saffron: "#f2b31a",
	plum: "#6a3d8f",
} as const;

// Old Safari UA makes Google Fonts serve TTF; Satori can't read the woff2 modern browsers get.
const TTF_USER_AGENT = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

export const alt = `${SITE.wordmark}, ${SITE.role.toLowerCase()} in ${SITE.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const loadJost = async (weight: number): Promise<ArrayBuffer> => {
	const css = await fetch(`https://fonts.googleapis.com/css2?family=Jost:wght@${weight}`, {
		headers: { "User-Agent": TTF_USER_AGENT },
	}).then((res) => res.text());
	const fontUrl = css.match(/src: url\((.+?)\)/)?.[1];
	if (!fontUrl) throw new Error(`Jost ${weight} font URL not found in Google Fonts CSS`);
	return fetch(fontUrl).then((res) => res.arrayBuffer());
};

const OpenGraphImage = async (): Promise<ImageResponse> => {
	const [light, regular] = await Promise.all([loadJost(300), loadJost(500)]);

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					background: COLORS.cloud,
					color: COLORS.indigoDeep,
					fontFamily: "Jost",
					padding: "72px 80px 0",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<svg width="72" height="72" viewBox="0 0 64 64">
						<rect width="64" height="64" rx="6" fill={COLORS.indigo} />
						<path d="M10 20H54M13.5 16.5V49M10 33H23M46.5 16.5V49" fill="none" stroke={COLORS.cloud} strokeWidth="7" />
						<rect x="28" y="28" width="7" height="21" fill={COLORS.saffron} />
					</svg>
					<div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: COLORS.indigo }}>
						{`${SITE.role} · ${SITE.city}`}
					</div>
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ display: "flex", fontSize: 120, fontWeight: 500, lineHeight: 1, letterSpacing: -3 }}>
						{SITE.wordmark}
					</div>
					<div style={{ display: "flex", fontSize: 44, fontWeight: 300, marginTop: 24, color: COLORS.indigo }}>
						One product. The web app <span style={{ color: COLORS.madder, margin: "0 12px" }}>and</span> the mobile app.
					</div>
					<div style={{ display: "flex", fontSize: 22, marginTop: 36, color: COLORS.plum, letterSpacing: 1 }}>
						{STACK.map((s) => s.tools.split(", ")[0]).join("  /  ")}
					</div>
				</div>

				<div
					style={{
						display: "flex",
						height: 28,
						margin: "0 -80px",
						background: `linear-gradient(90deg, ${COLORS.indigo} 0%, ${COLORS.plum} 35%, ${COLORS.madder} 70%, ${COLORS.saffron} 100%)`,
					}}
				/>
			</div>
		),
		{
			...size,
			fonts: [
				{ name: "Jost", data: light, weight: 300, style: "normal" },
				{ name: "Jost", data: regular, weight: 500, style: "normal" },
			],
		},
	);
};

export default OpenGraphImage;
