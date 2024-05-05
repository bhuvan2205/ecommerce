import { ReactNode } from "react";

export default function PageHeader({
	children,
	centered = false,
}: {
	children: ReactNode;
	centered?: boolean;
}) {
	return (
		<h1 className={`text-4xl mb-4 ${centered && "text-center"}`}>{children}</h1>
	);
}
