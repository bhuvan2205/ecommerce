import { getSingleProduct } from "@/data/product";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export const GET = async (
	request: NextRequest,
	{ params: { id } }: { params: { id: string } }
) => {
	const product = await getSingleProduct(id);

	if (!product) {
		return notFound();
	}

	const { size } = await fs.stat(product.filePath);
	const file = await fs.readFile(product.filePath);
	const extension = product.filePath.split(".").pop();

	return new NextResponse(file, {
		headers: {
			"Content-Length": size.toString(),
			"Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
		},
	});
};
