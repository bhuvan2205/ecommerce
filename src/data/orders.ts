import prisma from "@/config/db";

export const getOrders = async () => {
	return prisma.order.findMany({
		select: {
			id: true,
			pricePaidInCents: true,
			product: { select: { name: true } },
			user: { select: { email: true } },
		},
		orderBy: { createdAt: "desc" },
	});
};
