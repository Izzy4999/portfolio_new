import type { NameWord } from "@/types/curtain";

/**
 * Splits a name into words and letters, tagging each letter with its distance
 * from the middle of the name so the reveal can run from the centre outward.
 */
export const buildNameWords = (fullName: string): NameWord[] => {
	const words = fullName.split(" ");
	const middle = (words.join("").length - 1) / 2;
	return words.map((text, wordIndex) => {
		const lettersBefore = words.slice(0, wordIndex).join("").length;
		return {
			text,
			letters: text.split("").map((char, letterIndex) => ({
				char,
				fromMiddle: Math.abs(lettersBefore + letterIndex - middle),
			})),
		};
	});
};
