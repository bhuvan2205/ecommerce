import Navbar from "@/components/Navbar";
import NavLink from "@/components/NavLink";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar>
				<NavLink href="/">Home</NavLink>
				<NavLink href="/products">Products</NavLink>
				<NavLink href="/orders">My Orders</NavLink>
			</Navbar>
			<div className="container my-6">{children}</div>
		</>
	);
}
