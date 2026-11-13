import { axiosBase } from "@/services/axios-instances";
import type { UploadResponse } from "@/types/upload";

const UPLOAD_ENDPOINT = "/api/admin/uploads" as const;
const UPLOAD_TIMEOUT_MS = 60_000;

// The admin session is an HttpOnly cookie, which the browser attaches to same-origin requests itself.
export const uploadScreenshotRequest = async (file: File): Promise<UploadResponse> => {
	const formData = new FormData();
	formData.append("file", file);
	const response = await axiosBase.post<UploadResponse>(UPLOAD_ENDPOINT, formData, {
		headers: { "Content-Type": "multipart/form-data" },
		timeout: UPLOAD_TIMEOUT_MS,
	});
	return response.data;
};
