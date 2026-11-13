import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { signAdminSession } from "@/lib/auth";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_SECONDS } from "@/lib/constants";
import { loginSchema } from "@/schemas/admin";

export async function POST(req: NextRequest): Promise<NextResponse> {
	const passwordHash = process.env.ADMIN_PASSWORD_HASH;
	if (!passwordHash) {
		return NextResponse.json(
			{ message: "Admin login is not configured", code: "NOT_CONFIGURED" },
			{ status: 500 },
		);
	}

	const parsed = loginSchema.safeParse(await req.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json(
			{ message: "Password is required", code: "INVALID_INPUT" },
			{ status: 400 },
		);
	}

	const isValid = await bcrypt.compare(parsed.data.password, passwordHash);
	if (!isValid) {
		return NextResponse.json(
			{ message: "Incorrect password", code: "INVALID_CREDENTIALS" },
			{ status: 401 },
		);
	}

	const token = await signAdminSession();
	const response = NextResponse.json({ message: "Signed in" });
	response.cookies.set(ADMIN_SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: ADMIN_SESSION_TTL_SECONDS,
	});
	return response;
}
