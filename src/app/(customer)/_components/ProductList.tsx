import ProductCard from "@/components/ProductCard";
import { Product } from "@prisma/client";

export async function ProductList({
	fetchProducts,
}: {
	fetchProducts: () => Promise<Product[]>;
}) {
	const products = await fetchProducts();
	return (
		<>
			{products?.map((product) => (
				<ProductCard
					key={product.id}
					name={product.name}
					priceInCents={product.priceInCents}
					description={product.description}
					id={product.id}
					imagePath={product.imagePath}
				/>
			))}
		</>
	);
}
