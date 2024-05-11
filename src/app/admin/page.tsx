import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	getProductsData,
	getSalesData,
} from "@/data/product";
import { getCustomersData } from "@/data/users";
import { formatCurrency, formatNumber } from "@/lib/helper";
import { sleep } from "@/lib/utils";

export default async function Page() {
	await sleep(1500);
	const [salesData, customersData, productsData] = await Promise.all([
		getSalesData(),
		getCustomersData(),
		getProductsData(),
	]);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<DashboardCard
				title="Sales"
				subtitle={`${formatNumber(salesData.numberOfSales)} order(s)`}
				description={formatCurrency(salesData.amount)}
			/>
			<DashboardCard
				title="Customers"
				subtitle={`${formatCurrency(
					customersData.averageValuePerUser
				)} average value`}
				description={formatNumber(customersData.userCount)}
			/>
			<DashboardCard
				title="Active Products"
				subtitle={`${formatNumber(productsData.inActiveProducts)} Inactive`}
				description={formatNumber(productsData.activeProducts)}
			/>
		</div>
	);
}

type DashboardCardProps = {
	title: string;
	subtitle: string;
	description: string;
};

export function DashboardCard(props: DashboardCardProps) {
	const { title, subtitle, description } = props || {};
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{subtitle}</CardDescription>
				</CardHeader>
				<CardContent>
					<p>{description}</p>
				</CardContent>
			</Card>
		</>
	);
}
