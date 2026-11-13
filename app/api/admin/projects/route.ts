import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, handleUnknownError } from "@/lib/api-error";
import { projectSchema } from "@/schemas/admin";

export async function GET(): Promise<NextResponse> {
	try {
		const projects = await prisma.project.findMany({
			orderBy: [{ order: "asc" }, { createdAt: "desc" }],
		});
		return NextResponse.json({ projects });
	} catch (error) {
		return handleUnknownError(error, "admin/projects:GET");
	}
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	const parsed = projectSchema.safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", "INVALID_INPUT", 400);
	}

	try {
		const existing = await prisma.project.findUnique({
			where: { slug: parsed.data.slug },
		});
		if (existing) {
			return errorResponse("A project with this slug already exists", "SLUG_TAKEN", 409);
		}

		const project = await prisma.project.create({ data: parsed.data });
		return NextResponse.json({ project }, { status: 201 });
	} catch (error) {
		return handleUnknownError(error, "admin/projects:POST");
	}
}
