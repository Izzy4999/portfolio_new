import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, handleUnknownError } from "@/lib/api-error";
import { projectSchema } from "@/schemas/admin";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: Params): Promise<NextResponse> {
	const { id } = await params;
	try {
		const project = await prisma.project.findUnique({ where: { id } });
		if (!project) {
			return errorResponse("Project not found", "NOT_FOUND", 404);
		}
		return NextResponse.json({ project });
	} catch (error) {
		return handleUnknownError(error, "admin/projects/[id]:GET");
	}
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
	const { id } = await params;
	const parsed = projectSchema.partial().safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", "INVALID_INPUT", 400);
	}

	try {
		if (parsed.data.slug) {
			const existing = await prisma.project.findUnique({
				where: { slug: parsed.data.slug },
			});
			if (existing && existing.id !== id) {
				return errorResponse("A project with this slug already exists", "SLUG_TAKEN", 409);
			}
		}

		const project = await prisma.project.update({
			where: { id },
			data: parsed.data,
		});
		return NextResponse.json({ project });
	} catch (error) {
		return handleUnknownError(error, "admin/projects/[id]:PATCH");
	}
}

export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
	const { id } = await params;
	try {
		await prisma.project.delete({ where: { id } });
		return NextResponse.json({ message: "Project deleted" });
	} catch (error) {
		return handleUnknownError(error, "admin/projects/[id]:DELETE");
	}
}
