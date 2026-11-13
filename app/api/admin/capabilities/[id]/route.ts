import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, handleUnknownError } from "@/lib/api-error";
import { capabilitySchema } from "@/schemas/admin";

type Params = {
	params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
	const { id } = await params;
	const parsed = capabilitySchema.partial().safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", "INVALID_INPUT", 400);
	}

	try {
		const capability = await prisma.capability.update({
			where: { id },
			data: parsed.data,
		});
		return NextResponse.json({ capability });
	} catch (error) {
		return handleUnknownError(error, "admin/capabilities/[id]:PATCH");
	}
}

export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
	const { id } = await params;
	try {
		await prisma.capability.delete({ where: { id } });
		return NextResponse.json({ message: "Capability deleted" });
	} catch (error) {
		return handleUnknownError(error, "admin/capabilities/[id]:DELETE");
	}
}
