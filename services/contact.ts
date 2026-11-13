import { axiosBase } from "@/services/axios-instances";
import type { ContactPayload, ContactResponse } from "@/types/contact";

const CONTACT_ENDPOINT = "/api/contact" as const;

export const sendContactRequest = async (payload: ContactPayload): Promise<ContactResponse> => {
	const response = await axiosBase.post<ContactResponse>(CONTACT_ENDPOINT, payload);
	return response.data;
};
