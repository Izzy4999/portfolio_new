import { randomUUID } from "node:crypto";
import axios, { isAxiosError } from "axios";

const SCREENSHOT_BUCKET = "project-screens" as const;
const HTTP_CONFLICT = 409;
const STORAGE_TIMEOUT_MS = 30_000;

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export const SCREENSHOT_EXTENSIONS: Record<string, string> = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
};

export class StorageNotConfiguredError extends Error {
	constructor() {
		super("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set");
	}
}

type StorageConfig = {
	baseUrl: string;
	headers: { Authorization: string };
};

const getStorageConfig = (): StorageConfig => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		throw new StorageNotConfiguredError();
	}
	return { baseUrl: `${url.replace(/\/$/, "")}/storage/v1`, headers: { Authorization: `Bearer ${key}` } };
};

const ensureBucket = async ({ baseUrl, headers }: StorageConfig): Promise<void> => {
	try {
		await axios.post(
			`${baseUrl}/bucket`,
			{ id: SCREENSHOT_BUCKET, name: SCREENSHOT_BUCKET, public: true },
			{ headers, timeout: STORAGE_TIMEOUT_MS },
		);
	} catch (error) {
		// Supabase answers 409 (or 400 with statusCode "409") when the bucket is already there.
		const alreadyExists =
			isAxiosError(error) &&
			(error.response?.status === HTTP_CONFLICT || String(error.response?.data?.statusCode) === String(HTTP_CONFLICT));
		if (!alreadyExists) throw error;
	}
};

export const uploadScreenshot = async (file: File): Promise<string> => {
	const config = getStorageConfig();
	await ensureBucket(config);

	// The stored name never uses the visitor's file name, only a random id and the checked type.
	const objectPath = `${randomUUID()}.${SCREENSHOT_EXTENSIONS[file.type]}`;
	await axios.post(`${config.baseUrl}/object/${SCREENSHOT_BUCKET}/${objectPath}`, Buffer.from(await file.arrayBuffer()), {
		headers: { ...config.headers, "Content-Type": file.type, "Cache-Control": "max-age=31536000" },
		timeout: STORAGE_TIMEOUT_MS,
		maxBodyLength: MAX_SCREENSHOT_BYTES,
	});

	return `${config.baseUrl}/object/public/${SCREENSHOT_BUCKET}/${objectPath}`;
};
