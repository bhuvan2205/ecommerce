import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";

type CallBack = (...args: any[]) => Promise<any>;

export default function cache(
	cb: CallBack,
	key: string[],
	options: {
		revalidate?: number | false;
		tags?: string[];
	} = {}
) {
	return unstable_cache(reactCache(cb), key, options);
}
