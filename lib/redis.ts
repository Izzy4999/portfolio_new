import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis: Redis | null =
	redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

export const getProjectViews = async (
	slugs: string[],
): Promise<Record<string, number>> => {
	if (!redis || slugs.length === 0) {
		return slugs.reduce(
			(acc, slug) => {
				acc[slug] = 0;
				return acc;
			},
			{} as Record<string, number>,
		);
	}

	const counts = await redis.mget<number[]>(
		...slugs.map((slug) => ["pageviews", "projects", slug].join(":")),
	);

	return slugs.reduce(
		(acc, slug, i) => {
			acc[slug] = counts[i] ?? 0;
			return acc;
		},
		{} as Record<string, number>,
	);
};

export const getProjectView = async (slug: string): Promise<number> => {
	if (!redis) return 0;
	return (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0;
};

export const incrProjectView = async (slug: string): Promise<void> => {
	if (!redis) return;
	await redis.incr(["pageviews", "projects", slug].join(":"));
};

export const setIfNewViewer = async (hash: string, slug: string): Promise<boolean> => {
	if (!redis) return true;
	const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
		nx: true,
		ex: 24 * 60 * 60,
	});
	return Boolean(isNew);
};
