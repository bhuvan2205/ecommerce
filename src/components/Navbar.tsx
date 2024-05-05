import { ReactNode } from "react";


export default function Navbar({ children }: { children: ReactNode }) {
	return (
		<nav className="flex bg-primary text-primary-foreground justify-center px-4">
			{children}
		</nav>
	);
}


