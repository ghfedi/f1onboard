"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import githubIcon from "public/icons/github.svg";
import coffeeIcon from "public/icons/bmc-logo.svg";
import logo	from "public/icons/logo.png";


type Props = {
	icon: "github" | "bmc" | "lgtm" | "logo";
	href: string;
	children: string;
};

function getIcon(icon: Props["icon"]) {
	switch (icon) {
		case "bmc":
			return coffeeIcon;
		case "logo":
			return logo;
		default:
			return githubIcon;
	}
}

export default function IconLabelButton({ icon, href, children }: Props) {
	return (
		<a target="_blank" href={href}>
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className="flex cursor-pointer select-none items-center gap-2"
			>
				<Image src={getIcon(icon)} alt={icon} width={20} height={20} />
				<p>{children}</p>
			</motion.div>
		</a>
	);
}
