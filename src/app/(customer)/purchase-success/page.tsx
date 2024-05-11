import { Button } from "@/components/ui/button";
import prisma from "@/config/db";
import { getSingleProduct } from "@/data/product";
import { formatCurrency } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { createDownloadVerification } from "../actions/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function Page({
	searchParams: { payment_intent },
}: {
	searchParams: { payment_intent: string };
}) {
	const paymentInfo = await stripe.paymentIntents.retrieve(payment_intent);
	const { productId } = paymentInfo?.metadata || {};

	if (!productId) return notFound();

	const product = await getSingleProduct(productId);

	if (!product) return notFound();

	const isSuccess = paymentInfo?.status === "succeeded";

	return (
		<div className="max-w-5xl mx-auto w-full space-y-8">
			<h1 className="text-4xl font-bold">{isSuccess ? "Success" : "Error"}</h1>
			<div className="flex gap-4 items-center">
				<div className="aspect-video flex-shrink-0 w-1/3 relative">
					<Image src={product?.imagePath} alt={product?.name} fill />
				</div>
				<div>
					<div className="text-lg">{formatCurrency(product?.priceInCents)}</div>
					<h1 className="font-bold text-2xl">{product?.name}</h1>
					<p className="text-muted-foreground line-clamp-3">
						{product?.description}
					</p>
					<Button className="mt-4" size="lg" asChild>
						{isSuccess ? (
							<a
								href={`/products/download/${await createDownloadVerification(
									product.id
								)}`}>
								Download
							</a>
						) : (
							<Link href={`/products/${product.id}/purchase`}>Try again</Link>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}

