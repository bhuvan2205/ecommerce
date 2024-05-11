import prisma from "@/config/db";
import cache from "@/lib/cache";

export const getSingleProduct = async (id: string) =>
	await prisma.product.findUnique({
		where: {
			id,
		},
	});

export const getSalesData = async () => {
	const data = await prisma.order.aggregate({
		_sum: {
			pricePaidInCents: true,
		},
		_count: true,
	});

	return {
		amount: (data._sum.pricePaidInCents ?? 0) / 100,
		numberOfSales: data._count ?? 0,
	};
};

export const getCustomersData = async () => {
	const [userCount, orderData] = await Promise.all([
		prisma.user.count(),
		prisma.order.aggregate({
			_sum: {
				pricePaidInCents: true,
			},
		}),
	]);

	return {
		userCount,
		averageValuePerUser:
			userCount === 0
				? 0
				: (orderData._sum.pricePaidInCents ?? 0) / userCount / 100,
	};
};

export const getProductsData = async () => {
	const [activeProducts, inActiveProducts] = await Promise.all([
		prisma.product.count({
			where: {
				isAvailableForPurchase: true,
			},
		}),
		prisma.product.count({
			where: {
				isAvailableForPurchase: false,
			},
		}),
	]);
	return {
		activeProducts,
		inActiveProducts,
	};
};

export const getPopularProducts = cache(
	async () => {
		return await prisma.product.findMany({
			where: {
				isAvailableForPurchase: true,
			},
			orderBy: {
				orders: { _count: "desc" },
			},
			take: 6,
		});
	},
	["/", "getPopularProducts"],
	{ revalidate: 60 * 24 * 60 }
);

export const getNewProducts = cache(async () => {
	return await prisma.product.findMany({
		where: {
			isAvailableForPurchase: true,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 6,
	});
}, ["/", "getNewProducts"]);

export const getAllProducts = cache(
	async () => {
		return await prisma.product.findMany({
			where: {
				isAvailableForPurchase: true,
			},
			orderBy: { name: "asc" },
		});
	},
	["/products", "getAllProducts"],
	{}
);
