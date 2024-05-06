"use server";

import prisma from "@/config/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
	(file) => file.size === 0 || file.type.startsWith("image/")
);

const productSchema = z.object({
	name: z.string().min(3),
	description: z.string().min(5),
	priceInCents: z.coerce.number().int().min(1),
	file: fileSchema.refine((file) => file.size > 0, "Required"),
	image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prev: unknown, formData: FormData) {
	const productData = Object.fromEntries(formData.entries());
	const { success, data, error } = productSchema.safeParse(productData);

	if (!success) {
		console.log("Error:", error.formErrors.fieldErrors);
		return error.formErrors.fieldErrors;
	}

	const { name, description, file, image, priceInCents } = data;

	await fs.mkdir("products", { recursive: true });
	const filePath = `products/${crypto.randomUUID()}-${file.name}`;
	await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

	await fs.mkdir("public/products", { recursive: true });
	const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
	await fs.writeFile(
		`public${imagePath}`,
		Buffer.from(await image.arrayBuffer())
	);

	await prisma.product.create({
		data: {
			name,
			description,
			priceInCents,
			filePath,
			imagePath,
		},
	});

	redirect(ROUTES.ADMIN_PRODUCTS);
}

export async function toggleProductAvailability(
	id: string,
	isAvailableForPurchase: boolean
) {
	await prisma.product.update({
		where: {
			id,
		},
		data: {
			isAvailableForPurchase,
		},
	});
}

export async function deleteProduct(id: string) {
	const product = await prisma.product.delete({
		where: {
			id,
		},
	});

	if (!product) return notFound();
}
