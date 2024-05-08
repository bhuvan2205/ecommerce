"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/helper";
import { useState } from "react";
import { addProduct, editProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export default function ProductForm({ product }: { product?: Product }) {
	const [error, action] = useFormState(
		product ? editProduct.bind(null, product?.id) : addProduct,
		{}
	);
	const [price, setPrice] = useState<number | undefined>(product?.priceInCents);
	return (
		<form action={action} className="space-y-8 max-w-md mx-auto">
			<div className="space-y-2">
				<Label htmlFor="name">Name</Label>
				<Input
					type="text"
					id="name"
					name="name"
					defaultValue={product?.name}
					required
				/>
				{error.name && <div className="text-destructive">{error.name}</div>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="priceInCents">Price In Cents</Label>
				<Input
					type="number"
					id="priceInCents"
					name="priceInCents"
					required
					value={price}
					onChange={(e) => setPrice(Number(e.target.value))}
				/>
				<div className="text-muted-foreground">
					{formatCurrency((price || 0) / 100)}
				</div>
				{error.priceInCents && (
					<div className="text-destructive">{error.priceInCents}</div>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Input
					type="text"
					name="description"
					defaultValue={product?.description}
					id="description"
					required
				/>
				{error.description && (
					<div className="text-destructive">{error.description}</div>
				)}
			</div>
			<div className="space-y-2">
				<Label htmlFor="file">File</Label>
				<Input type="file" name="file" id="file" required={!product} />
				{!!product && (
					<div className="text-muted-foreground">{product?.filePath}</div>
				)}
				{error.file && <div className="text-destructive">{error.file}</div>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="image">Image</Label>
				<Input type="file" name="image" id="image" required={!product} />
				{!!product && (
					<Image
						height="400"
						width="400"
						src={product?.imagePath}
						alt={product?.name}
					/>
				)}
				{error.image && <div className="text-destructive">{error.image}</div>}
			</div>
			<SubmitButton />
		</form>
	);
}

export function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Saving..." : "Save"}
		</Button>
	);
}
