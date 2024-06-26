import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";

type PurchaseReceiptEmailProps = {
	product: {
		name: string;
		imagePath: string;
		description: string;
	};
	order: { id: string; createdAt: Date; pricePaidInCents: number };
	downloadVerificationId: string;
};

PurchaseReceiptEmail.PreviewProps = {
	product: {
		name: "Product name",
		description: "Some description",
		imagePath:
			"/products/90f217b4-0335-4a67-be99-62d93838950a-Screenshot from 2024-04-10 16-53-16.png",
	},
	order: {
		id: crypto.randomUUID(),
		createdAt: new Date(),
		pricePaidInCents: 10000,
	},
	downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
	product,
	order,
	downloadVerificationId,
}: PurchaseReceiptEmailProps) {
	console.log(
		"🚀 ~ file: index.tsx ~ line 30 ~ PurchaseReceiptEmail ~ product",
		product
	);
	return (
		<Html>
			<Preview>Download {product.name} and view receipt</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Purchase Receipt</Heading>
						<OrderInformation
							order={order}
							product={product}
							downloadVerificationId={downloadVerificationId}
						/>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
