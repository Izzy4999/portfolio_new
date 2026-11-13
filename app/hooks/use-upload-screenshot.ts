import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/errors";
import { uploadScreenshotRequest } from "@/services/uploads";
import type { UploadResponse } from "@/types/upload";

export const useUploadScreenshot = (): UseMutationResult<UploadResponse, Error, File> =>
	useMutation({
		mutationFn: uploadScreenshotRequest,
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Could not upload that image. Please try again."));
		},
	});
