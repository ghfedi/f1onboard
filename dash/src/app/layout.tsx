import { type ReactNode } from "react";
import Script from "next/script";
import Theme from '../../theme-provider'

import "@/styles/globals.css";

import { env } from "@/env.mjs";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export { metadata } from "@/metadata";
export { viewport } from "@/viewport";



export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
		<body>
		<Theme>{children}</Theme>
		</body>

		</html>

	);
}
