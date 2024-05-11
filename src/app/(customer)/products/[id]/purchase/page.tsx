import { getSingleProduct } from "@/data/product";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const product = await getSingleProduct(id);

	if (!product) {
		return notFound();
	}

	const paymentIntent = await stripe.paymentIntents.create({
		amount: product.priceInCents,
		currency: "USD",
		shipping: {
			name: "Jenny Rosen",
			address: {
				line1: "510 Townsend St",
				postal_code: "98140",
				city: "San Francisco",
				state: "CA",
				country: "US",
			},
		},
		description: "Software development services",
		metadata: { productId: product.id },
	});

	if (!paymentIntent.client_secret) {
		throw new Error("Failed to create Stripe Payment Intent");
	}

	return (
		<CheckoutForm
			product={product}
			clientSecret={paymentIntent.client_secret as string}
		/>
	);
}
