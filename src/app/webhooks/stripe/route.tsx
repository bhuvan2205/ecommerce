import { createDownloadVerification } from "@/app/(customer)/_actions/order";
import prisma from "@/config/db";
import { getSingleProduct } from "@/data/product";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceiptEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.EMAIL_SECRET_KEY!);

export async function POST(request: NextRequest) {
	const event = stripe.webhooks.constructEvent(
		await request.text(),
		request.headers.get("stripe-signature")!,
		process.env.STRIPE_WEBHOOK_KEY!
	);

	console.log("🚀 ~ POST ~ event:", event.type);

	if (event.type === "charge.succeeded") {
		const charge = event.data.object;
		const productId = charge.metadata.productId;
		const email = charge.billing_details.email;
		const pricePaidInCents = charge.amount;

		console.log("🚀 ~ POST ~ email:", email);

		const product = await getSingleProduct(productId);

		if (!product || !email) {
			return new NextResponse("Bad Request", { status: 400 });
		}

		const userFields = {
			email,
			orders: {
				create: {
					productId,
					pricePaidInCents,
				},
			},
		};

		const {
			orders: [order],
		} = await prisma.user.upsert({
			where: { email },
			create: userFields,
			update: userFields,
			select: {
				orders: {
					orderBy: { createdAt: "desc" },
					take: 1,
				},
			},
		});
		console.log("🚀 ~ POST ~ order:", order);

		const downloadVerificationId = await createDownloadVerification(productId);

		await resend.emails.send({
			from: `Support <${process.env.SENDER_EMAIL}>`,
			to: email,
			subject: "Order Confirmation",
			react: (
				<PurchaseReceiptEmail
					order={order}
					product={product}
					downloadVerificationId={downloadVerificationId}
				/>
			),
		});
	}

	return new NextResponse();
}
