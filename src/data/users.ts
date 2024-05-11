import prisma from "@/config/db";

export const getUsers = async () => {
	return await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			orders: { select: { pricePaidInCents: true } },
		},
		orderBy: { createdAt: "desc" },
	});
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
