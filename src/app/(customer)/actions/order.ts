"use server";

import prisma from "@/config/db";

export async function userOrderExists(email: string, productId: string) {
	const order = await prisma.order.findFirst({
		where: { user: { email }, productId },
		select: { id: true },
	});

	return !!order;
}

export async function createDownloadVerification(productId: string) {
	return (
		await prisma.downloadVerification.create({
			data: {
				productId,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
			},
		})
	).id;
}
