import { NextResponse } from "next/server";

export const errorResponse = (
	message: string,
	code: string,
	status: number,
): NextResponse => {
	return NextResponse.json({ message, code }, { status });
};

export const handleUnknownError = (error: unknown, context: string): NextResponse => {
	console.error(`[${context}]`, error);
	return errorResponse("Something went wrong", "INTERNAL_ERROR", 500);
};
