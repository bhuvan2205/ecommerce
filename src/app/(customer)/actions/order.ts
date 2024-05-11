"use server";

import prisma from "@/config/db";

export async function userOrderExists(email: string, productId: string) {
	const order = await prisma.order.findFirst({
		where: { user: { email }, productId },
		select: { id: true },
	});

	return !!order;
}
