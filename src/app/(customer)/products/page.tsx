import { ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";
import { ProductList } from "../_components/ProductList";
import { getAllProducts } from "@/data/product";



export default function Page() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			<Suspense
				fallback={
					<>
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
					</>
				}>
				<ProductList fetchProducts={getAllProducts} />
			</Suspense>
		</div>
	);
}
