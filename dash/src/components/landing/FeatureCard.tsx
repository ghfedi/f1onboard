import type { ReactNode } from "react";

type Props = {
	title: string;
	description: string;
	children: ReactNode;
};

export default function FeatureCard({ title, description, children }: Props) {
	return (
		<div className="flex flex-col gap-2 rounded-md glass p-4">
			<p className="text-lg font-medium leading-none">{title}</p>
			<p className="leading-tight text-zinc-200">{description}</p>
			{children}
		</div>
	);
}
