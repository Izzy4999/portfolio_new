import { z } from "zod";

const MESSAGE_MIN_LENGTH = 10;

export const contactSchema = z.object({
	name: z.string().trim().min(1, "Tell me your name"),
	email: z.string().trim().email("Enter a valid email address"),
	phone: z.string().trim().optional(),
	message: z
		.string()
		.trim()
		.min(MESSAGE_MIN_LENGTH, `Write at least ${MESSAGE_MIN_LENGTH} characters`),
});
