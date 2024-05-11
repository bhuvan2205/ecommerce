import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import prisma from "@/config/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ProductList } from "./_components/ProductList";
import { getNewProducts, getPopularProducts } from "@/data/product";

export default function Page() {
	return (
		<main className="space-y-12">
			<ProductSection fetchProducts={getNewProducts} title="New Arrivals" />
			<ProductSection fetchProducts={getPopularProducts} title="Most Popular" />
		</main>
	);
}

export function ProductSection({
	fetchProducts,
	title,
}: {
	fetchProducts: () => Promise<Product[]>;
	title: string;
}) {
	return (
		<div className="space-y-4">
			<div className="flex gap-4">
				<h1 className="text-3xl font-bold">{title}</h1>
				<Button variant="outline" asChild>
					<Link href="/products" className="space-x-2">
						<span>View All</span>
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				<Suspense
					fallback={
						<>
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
						</>
					}>
					<ProductList fetchProducts={fetchProducts} />
				</Suspense>
			</div>
		</div>
	);
}
