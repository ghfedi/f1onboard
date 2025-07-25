"use client";

import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";

type Props<T> = {
	id?: string;
	className?: string;
	options: {
		label: string;
		value: T;
	}[];
	selected: T;
	onSelect?: (val: T) => void;
};

export default function SegmentedControls<T>({ id, className, options, selected, onSelect }: Props<T>) {
	return (
		<LayoutGroup>
			<div id={id} className={clsx("glass m-0 inline-flex h-fit justify-between rounded-lg p-0.5", className)}>
				{options.map((option, i) => {
					const isActive = option.value === selected;
					return (
						<motion.div
							className="relative mb-0 leading-none"
							whileTap={isActive ? { scale: 0.95 } : { opacity: 0.6 }}
							key={option.label}
						>
							<button
								onClick={() => (onSelect ? onSelect(option.value) : void 0)}
								className="relative m-0 border-none bg-transparent px-5 py-2 leading-none"
							>
								{isActive && (
									<motion.div
										layoutId={`segment-${id}`}
										className="absolute bottom-0 left-0 right-0 top-0 z-[1] rounded-md bg-zinc-400"
									/>
								)}
								<span className="relative z-[2]">{option.label}</span>
							</button>
						</motion.div>
					);
				})}
			</div>
		</LayoutGroup>
	);
}
