import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import PageHeader from "../_components/PageHeader";
import { getOrders } from "@/data/orders";
import { formatCurrency } from "@/lib/helper";
import { DeleteDropDownItem } from "./_components/UserActions";

export default function OrdersPage() {
	return (
		<>
			<PageHeader>Sales</PageHeader>
			<OrdersTable />
		</>
	);
}

async function OrdersTable() {
	const orders = await getOrders();

	if (orders.length === 0) return <p>No sales found</p>;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Product</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead>Price Paid</TableHead>
					<TableHead className="w-0">
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.map((order) => (
					<TableRow key={order.id}>
						<TableCell>{order.product.name}</TableCell>
						<TableCell>{order.user.email}</TableCell>
						<TableCell>
							{formatCurrency(order.pricePaidInCents / 100)}
						</TableCell>
						<TableCell className="text-center">
							<DropdownMenu>
								<DropdownMenuTrigger>
									<MoreVertical />
									<span className="sr-only">Actions</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DeleteDropDownItem id={order.id} />
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
