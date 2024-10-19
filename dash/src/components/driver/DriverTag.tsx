import clsx from "clsx";

type Props = {
	teamColor: string;
	short: string;
	position?: number;
	className?: string;
	short2:string;
};

export default function DriverTag({ position, teamColor, short, className,short2 }: Props) {
	return (
		<div
			id="walkthrough-driver-position"
			style={{ }}
			className={clsx(
				"flex items-center justify-start gap-0.5  font-black",
				className,
			)}
		>
			{position && <p className="px-1 text-xl leading-none">{position}</p>}

			<div className="flex-col  h-min w-min items-start justify-start   px-1" >
				<p className="text-white font-formula1">
					{short}
				</p>
				<p className="font-formula1 text-zinc-600" style={{ ...(teamColor && { color: `#${teamColor}` }) }}>
					{short2}</p>
			</div>
		</div>
	);
}
