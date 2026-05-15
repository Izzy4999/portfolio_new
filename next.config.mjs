import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	experimental: {
		mdxRs: true,
	},
	// Satisfy Next.js 16: we have webpack config (from contentlayer) but use Turbopack
	turbopack: {},
};

export default withContentlayer(nextConfig);
