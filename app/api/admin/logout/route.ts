import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";

export async function POST(): Promise<NextResponse> {
	const response = NextResponse.json({ message: "Signed out" });
	response.cookies.delete(ADMIN_SESSION_COOKIE);
	return response;
}
