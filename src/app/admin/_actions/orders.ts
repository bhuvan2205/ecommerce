"use server";

import prisma from "@/config/db";
import { notFound } from "next/navigation";

export async function deleteOrder(id: string) {
	const order = await prisma.order.delete({
		where: { id },
	});

	if (!order) return notFound();

	return order;
}
