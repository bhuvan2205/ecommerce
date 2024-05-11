"use server";

import prisma from "@/config/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { revalidatePath } from "next/cache";

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

const editProductSchema = productSchema.extend({
	file: fileSchema.optional(),
	image: imageSchema.optional(),
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

	revalidatePath(ROUTES.HOME);
	revalidatePath(ROUTES.PRODUCTS);
	redirect(ROUTES.ADMIN_PRODUCTS);
}

export async function editProduct(
	id: string,
	prev: unknown,
	formData: FormData
) {
	const product = await prisma.product.findUnique({
		where: {
			id,
		},
	});

	if (!product) {
		return notFound();
	}

	const productData = Object.fromEntries(formData.entries());
	const { success, data, error } = editProductSchema.safeParse(productData);

	if (!success) {
		console.log("Error:", error.formErrors.fieldErrors);
		return error.formErrors.fieldErrors;
	}

	const { name, description, file, image, priceInCents } = data;

	let filePath = product.filePath;
	let imagePath = product.imagePath;

	if (file && file?.size > 0) {
		await fs.unlink(product.filePath);
		filePath = `products/${crypto.randomUUID()}-${file.name}`;
		await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
	}

	if (image && image?.size > 0) {
		await fs.unlink(`public${product.imagePath}`);
		const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
		await fs.writeFile(
			`public${imagePath}`,
			Buffer.from(await image.arrayBuffer())
		);
	}

	await prisma.product.update({
		where: {
			id,
		},
		data: {
			name,
			description,
			priceInCents,
			filePath,
			imagePath,
		},
	});

	revalidatePath(ROUTES.HOME);
	revalidatePath(ROUTES.PRODUCTS);
	revalidatePath(ROUTES.ADMIN_PRODUCTS);

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

	revalidatePath(ROUTES.HOME);
	revalidatePath(ROUTES.PRODUCTS);
}

export async function deleteProduct(id: string) {
	const product = await prisma.product.delete({
		where: {
			id,
		},
	});

	if (!product) return notFound();

	await fs.unlink(product.filePath);
	await fs.unlink(`public${product.imagePath}`);

	revalidatePath(ROUTES.HOME);
	revalidatePath(ROUTES.PRODUCTS);
}
