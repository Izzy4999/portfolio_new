export const SILK_TONES = ["indigo", "madder", "saffron"] as const;

export type SilkTone = (typeof SILK_TONES)[number];

export const SILK_BACKGROUND: Record<SilkTone, string> = {
	indigo: "bg-indigo",
	madder: "bg-madder",
	saffron: "bg-saffron",
};

export const toneAt = (index: number): SilkTone => SILK_TONES[index % SILK_TONES.length];
