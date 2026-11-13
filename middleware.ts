import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE } from "@/lib/constants";

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
	const { pathname } = req.nextUrl;
	const isLoginRoute =
		pathname === ADMIN_LOGIN_PATH || pathname === "/api/admin/login";

	if (isLoginRoute) {
		return NextResponse.next();
	}

	const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
	const isValid = token ? await verifyAdminSession(token) : false;

	if (isValid) {
		return NextResponse.next();
	}

	if (pathname.startsWith("/api/admin")) {
		return NextResponse.json({ message: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
	}

	const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url);
	return NextResponse.redirect(loginUrl);
}
