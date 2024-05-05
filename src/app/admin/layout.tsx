import Navbar from "@/components/Navbar";
import NavLink from "@/components/NavLink";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar>
				<NavLink href="/admin">Dashboard</NavLink>
				<NavLink href="/admin/products">Products</NavLink>
				<NavLink href="/admin/users">Customers</NavLink>
				<NavLink href="/admin/orders">Sales</NavLink>
			</Navbar>
			<div className="container my-6">{children}</div>
		</>
	);
}
