"use client";

import { userOrderExists } from "@/app/(customer)/actions/order";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/helper";
import {
	Elements,
	LinkAuthenticationElement,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
	product: {
		id: string;
		imagePath: string;
		name: string;
		priceInCents: number;
		description: string;
	};
	clientSecret: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutForm({
	product,
	clientSecret,
}: CheckoutFormProps) {
	return (
		<div className="max-w-5xl mx-auto w-full space-y-8">
			<div className="flex gap-4 items-center">
				<div className="aspect-video flex-shrink-0 w-1/3 relative">
					<Image src={product.imagePath} alt={product.name} fill />
				</div>
				<div>
					<div className="text-lg">{formatCurrency(product.priceInCents)}</div>
					<h1 className="font-bold text-2xl">{product.name}</h1>
					<p className="text-muted-foreground line-clamp-3">
						{product.description}
					</p>
				</div>
			</div>
			<Elements options={{ clientSecret }} stripe={stripePromise}>
				<PaymentForm price={product.priceInCents} productId={product.id} />
			</Elements>
		</div>
	);
}

const PaymentForm = ({
	price,
	productId,
}: {
	price: number;
	productId: string;
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!stripe || !elements || !email) {
			return;
		}

		setLoading(true);

		const orderExists = await userOrderExists(email, productId);

		if (orderExists) {
			setError(
				"You already have an purchase order for this product, Try downloading it from My Orders"
			);
			setLoading(false);
			return;
		}

		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase-success`,
				},
			});

			if (error.type === "card_error" || error.type === "validation_error") {
				setError(error.message as string);
			} else {
				setError("An unknown error occurred");
			}
		} catch (error) {
			setError("An unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Checkout</CardTitle>
					{error && (
						<CardDescription className="text-destructive">
							{error}
						</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<PaymentElement />
					<div className="mt-4">
						<LinkAuthenticationElement
							onChange={(e) => setEmail(e.value.email)}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button disabled={!stripe || !elements || loading}>
						Purchase - {formatCurrency(price / 100)}
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
};
