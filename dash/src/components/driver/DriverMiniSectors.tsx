import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { TimingDataDriver, TimingStatsDriver } from "@/types/state.type";

type Props = {
	sectors: TimingDataDriver["sectors"];
	bestSectors: TimingStatsDriver["bestSectors"] | undefined;
	tla: string;
	showFastest: boolean;
};

export default function DriverMiniSectors({ sectors = [], bestSectors, tla, showFastest }: Props) {
	// Vérification de sécurité pour éviter l'erreur TypeError
	if (!sectors || !Array.isArray(sectors)) {
		return (
			<div className="flex gap-2">
				<div className="text-zinc-400 text-sm">No sector data</div>
			</div>
		);
	}

	return (
		<div className="flex gap-2">
			{sectors.map((sector, i) => {
				// Vérification de sécurité pour chaque secteur
				if (!sector || !sector.segments || !Array.isArray(sector.segments)) {
					return (
						<div key={`sector.${tla}.${i}`} className="flex flex-col gap-1">
							<div className="text-zinc-400 text-xs">--</div>
						</div>
					);
				}

				return (
					<div key={`sector.${tla}.${i}`} className="flex flex-col gap-1">
						<div className="flex flex-row gap-1">
							{sector.segments.map((segment, j) => {
								// Vérification de sécurité pour chaque segment
								const segmentStatus = segment?.status ?? 0;
								return (
									<MiniSector status={segmentStatus} key={`sector.mini.${tla}.${j}`} />
								);
							})}
						</div>

						<div>
							<p
								className={clsx(
									"text-lg font-semibold leading-none",
									getTimeColor(sector.overallFastest, sector.personalFastest),
									!sector.value ? "text-zinc-400" : "",
									showFastest ? "!text-sm" : "",
								)}
							>
								{!!sector.value ? sector.value : !!sector.previousValue ? sector.previousValue : "-- ---"}
							</p>

							{showFastest && (
								<p className={clsx("text-sm font-semibold leading-none text-emerald-500")}>
									{bestSectors && bestSectors[i]?.value ? bestSectors[i].value : "-- ---"}
								</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

function MiniSector({ status }: { status: number }) {
	return (
		<div
			style={{ width: 10, height: 5, borderRadius: 2 }}
			className={clsx({
				"bg-amber-400": status === 2048 || status === 2052, // TODO unsure
				"bg-emerald-500": status === 2049,
				"bg-violet-600": status === 2051,
				"bg-blue-500": status === 2064,
				"bg-zinc-700": status === 0,
			})}
		/>
	);
}
