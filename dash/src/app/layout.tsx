import { type ReactNode } from "react";
import Script from "next/script";

import "@/styles/globals.css";

import { env } from "@/env.mjs";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/context/ThemeContext";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
			<head />

			<body className="bg-background text-foreground">
				<ThemeProvider>
					{children}
					<FloatingThemeToggle />
				</ThemeProvider>
			</body>
		</html>
	);
}
