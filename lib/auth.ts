import { SignJWT, jwtVerify } from "jose";
import { ADMIN_SESSION_TTL_SECONDS } from "./constants";

const getSecretKey = (): Uint8Array => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}
	return new TextEncoder().encode(secret);
};

export const signAdminSession = async (): Promise<string> => {
	return new SignJWT({ role: "admin" })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${ADMIN_SESSION_TTL_SECONDS}s`)
		.sign(getSecretKey());
};

export const verifyAdminSession = async (token: string): Promise<boolean> => {
	try {
		const { payload } = await jwtVerify(token, getSecretKey());
		return payload.role === "admin";
	} catch {
		return false;
	}
};
