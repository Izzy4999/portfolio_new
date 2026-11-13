import { isAxiosError } from "axios";

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
	if (isAxiosError<{ error?: string; message?: string }>(error)) {
		return error.response?.data?.error ?? error.response?.data?.message ?? fallback;
	}
	return fallback;
};
