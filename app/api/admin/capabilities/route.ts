import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, handleUnknownError } from "@/lib/api-error";
import { capabilitySchema } from "@/schemas/admin";

export async function GET(): Promise<NextResponse> {
	try {
		const capabilities = await prisma.capability.findMany({
			orderBy: { order: "asc" },
		});
		return NextResponse.json({ capabilities });
	} catch (error) {
		return handleUnknownError(error, "admin/capabilities:GET");
	}
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	const parsed = capabilitySchema.safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", "INVALID_INPUT", 400);
	}

	try {
		const capability = await prisma.capability.create({ data: parsed.data });
		return NextResponse.json({ capability }, { status: 201 });
	} catch (error) {
		return handleUnknownError(error, "admin/capabilities:POST");
	}
}
