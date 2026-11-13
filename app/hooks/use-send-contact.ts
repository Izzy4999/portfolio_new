import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/errors";
import { sendContactRequest } from "@/services/contact";
import type { ContactPayload, ContactResponse } from "@/types/contact";

export const useSendContact = (): UseMutationResult<ContactResponse, Error, ContactPayload> =>
	useMutation({
		mutationFn: sendContactRequest,
		onSuccess: () => {
			toast.success("Message sent. I will reply by email.");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Could not send your message. Please try again."));
		},
	});
