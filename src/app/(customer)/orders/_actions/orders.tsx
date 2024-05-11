"use server";

import prisma from "@/config/db";
import OrderHistoryEmail from "@/email/OrderHistory";
import { Resend } from "resend";
import { z } from "zod";

const emailSchema = z.string().email();
const resend = new Resend(process.env.EMAIL_SECRET_KEY);

export async function emailOrderHistory(
	prevState: unknown,
	formData: FormData
): Promise<{ message?: string; error?: string }> {
	const result = emailSchema.safeParse(formData.get("email"));

	if (result.success === false) {
		return { error: "Invalid email address" };
	}

	const user = await prisma.user.findUnique({
		where: { email: result.data },
		select: {
			email: true,
			orders: {
				select: {
					pricePaidInCents: true,
					id: true,
					createdAt: true,
					product: {
						select: {
							id: true,
							name: true,
							imagePath: true,
							description: true,
						},
					},
				},
			},
		},
	});

	if (!user) {
		return {
			message:
				"Check your email to view your order history and download your products.",
		};
	}

	const orders = await Promise.all(
		user.orders.map(async (order) => {
			const downloadVerificationId = (
				await prisma.downloadVerification.create({
					data: {
						expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
						productId: order.product.id,
					},
				})
			).id;

			return {
				...order,
				downloadVerificationId,
			};
		})
	);

	const data = await resend.emails.send({
		from: `Support <${process.env.SENDER_EMAIL}>`,
		to: user.email,
		subject: "Order History",
		react: <OrderHistoryEmail orders={orders} />,
	});

	if (data.error) {
		return {
			error: "There was an error sending your email. Please try again.",
		};
	}

	return {
		message:
			"Check your email to view your order history and download your products.",
	};
}