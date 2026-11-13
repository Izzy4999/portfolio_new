import { z } from "zod";

import { contactSchema } from "@/schemas/contact";

export type ContactPayload = z.infer<typeof contactSchema>;

export type ContactResponse = {
	success: boolean;
};

export type ChatOpenDetail = {
	question?: string;
};
