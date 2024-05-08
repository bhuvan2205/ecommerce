import PageHeader from "@/app/admin/_components/PageHeader";
import ProductForm from "../../_components/ProductForm";
import { notFound } from "next/navigation";
import { getSingleProduct } from "@/data/product";

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const product = await getSingleProduct(id);

	if (!product) {
		return notFound();
	}

	return (
		<>
			<PageHeader centered>Add Product</PageHeader>
			<ProductForm product={product} />
		</>
	);
}
