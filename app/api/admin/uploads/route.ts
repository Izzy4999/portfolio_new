import { NextRequest, NextResponse } from "next/server";

import { errorResponse, handleUnknownError } from "@/lib/api-error";
import {
	MAX_SCREENSHOT_BYTES,
	SCREENSHOT_EXTENSIONS,
	StorageNotConfiguredError,
	uploadScreenshot,
} from "@/lib/storage";

const BYTES_PER_MEGABYTE = 1024 * 1024;

// Signed-in admins only: middleware.ts guards every /api/admin route.
export async function POST(req: NextRequest): Promise<NextResponse> {
	const formData = await req.formData().catch(() => null);
	const file = formData?.get("file");

	if (!(file instanceof File)) {
		return errorResponse("Choose an image to upload", "INVALID_INPUT", 400);
	}
	if (!(file.type in SCREENSHOT_EXTENSIONS)) {
		return errorResponse("Use a PNG, JPG or WebP image", "UNSUPPORTED_TYPE", 400);
	}
	if (file.size > MAX_SCREENSHOT_BYTES) {
		return errorResponse(`Images must be under ${MAX_SCREENSHOT_BYTES / BYTES_PER_MEGABYTE} MB`, "FILE_TOO_LARGE", 400);
	}

	try {
		const url = await uploadScreenshot(file);
		return NextResponse.json({ url }, { status: 201 });
	} catch (error) {
		if (error instanceof StorageNotConfiguredError) {
			return errorResponse("Image storage is not set up yet. Add the Supabase keys to the environment.", "STORAGE_NOT_CONFIGURED", 503);
		}
		return handleUnknownError(error, "admin/uploads:POST");
	}
}
