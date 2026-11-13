import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, handleUnknownError } from "@/lib/api-error";
import { profileSchema } from "@/schemas/admin";

export async function GET(): Promise<NextResponse> {
	try {
		const profile = await prisma.profile.findFirst();
		if (!profile) {
			return errorResponse("Profile has not been seeded yet", "NOT_FOUND", 404);
		}
		return NextResponse.json({ profile });
	} catch (error) {
		return handleUnknownError(error, "admin/profile:GET");
	}
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
	const parsed = profileSchema.partial().safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", "INVALID_INPUT", 400);
	}

	try {
		const existing = await prisma.profile.findFirst();
		if (!existing) {
			return errorResponse("Profile has not been seeded yet", "NOT_FOUND", 404);
		}

		const profile = await prisma.profile.update({
			where: { id: existing.id },
			data: parsed.data,
		});
		return NextResponse.json({ profile });
	} catch (error) {
		return handleUnknownError(error, "admin/profile:PATCH");
	}
}
