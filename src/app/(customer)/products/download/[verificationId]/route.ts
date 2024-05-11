import fs from "fs/promises";
import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params: { verificationId } }: { params: { verificationId: string } }
) {
	const data = await prisma.downloadVerification.findUnique({
		where: {
			id: verificationId,
			expiresAt: {
				gt: new Date(),
			},
		},
		select: {
			product: {
				select: {
					filePath: true,
					name: true,
				},
			},
		},
	});

	if (!data) {
		return NextResponse.redirect(
			new URL("/products/download/expired", request.url)
		);
	}

	const { size } = await fs.stat(data.product.filePath);
	const file = await fs.readFile(data.product.filePath);
	const extension = data.product.filePath.split(".").pop();

	return new NextResponse(file, {
		headers: {
			"Content-Length": size.toString(),
			"Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
		},
	});
}
