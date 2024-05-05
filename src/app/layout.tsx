import type { Metadata } from "next";
import { Poppins as FontSans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["200", "400", "600", "800", "900"],
});

export const metadata: Metadata = {
	title: "E-commerce App",
	description: "To learn about Next.js and TypeScript",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased text-gray-900",
					fontSans.variable
				)}>
				{children}
			</body>
		</html>
	);
}
