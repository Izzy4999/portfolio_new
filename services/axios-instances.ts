import axios from "axios";

const REQUEST_TIMEOUT_MS = 20_000;

// The public site has no signed-in requests, so only the unauthenticated instance exists.
export const axiosBase = axios.create({
	timeout: REQUEST_TIMEOUT_MS,
	headers: { "Content-Type": "application/json" },
});
