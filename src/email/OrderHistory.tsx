import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";
import { Fragment } from "react";

type OrderHistoryEmailProps = {
	orders: {
		id: string;
		pricePaidInCents: number;
		createdAt: Date;
		downloadVerificationId: string;
		product: {
			name: string;
			imagePath: string;
			description: string;
		};
	}[];
};

OrderHistoryEmail.PreviewProps = {
	orders: [
		{
			id: crypto.randomUUID(),
			createdAt: new Date(),
			pricePaidInCents: 10000,
			downloadVerificationId: crypto.randomUUID(),
			product: {
				name: "Product name",
				description: "Some description",
				imagePath:
					"/products/90f217b4-0335-4a67-be99-62d93838950a-Screenshot from 2024-04-10 16-53-16.png",
			},
		},
		{
			id: crypto.randomUUID(),
			createdAt: new Date(),
			pricePaidInCents: 2000,
			downloadVerificationId: crypto.randomUUID(),
			product: {
				name: "Product name 2",
				description: "Some other desc",
				imagePath:
					"/products/90f217b4-0335-4a67-be99-62d93838950a-Screenshot from 2024-04-10 16-53-16.png",
			},
		},
	],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
	return (
		<Html>
			<Preview>Order History & Downloads</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Order History</Heading>
						{orders.map((order, index) => (
							<Fragment key={order.id}>
								<OrderInformation
									order={order}
									product={order.product}
									downloadVerificationId={order.downloadVerificationId}
								/>
								{index < orders.length - 1 && <Hr />}
							</Fragment>
						))}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}