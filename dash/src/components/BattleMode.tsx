import React, { useState, useEffect } from "react";
import { DriverList, TimingData, TimingStats, TimingAppData, CarsData } from "@/types/state.type";
import DriverTag from "@/components/driver/DriverTag";
import DriverBattle from "@/components/driver/DriverBattle";
import DriverLapTimesComparison from "@/components/DriverLapTimesComparison";
import DriverChart from "@/components/driver/DriverChart";

type Props = {
	drivers: DriverList | undefined;
	driversTiming: TimingData | undefined;
	driversTimingStats: TimingStats | undefined;
	driversAppTiming: TimingAppData | undefined;
	carsData: CarsData | null;
};

// BattleMode component allows users to select drivers and compare their performance
// It supports selecting up to 2 drivers and calculates the gap between them
// Displays selected drivers with their timing and car data
// The gap calculation is based on the gap to leader from the timing data

const BattleMode = ({ drivers, driversTiming, driversTimingStats, driversAppTiming, carsData }: Props) => {
	const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
	const [maxDrivers, setMaxDrivers] = useState<number>(2);

	const toggleDriverSelection = (racingNumber: string) => {
		setSelectedDrivers((prev) =>
			prev.includes(racingNumber)
				? prev.filter((num) => num !== racingNumber)
				: prev.length < maxDrivers
					? [...prev, racingNumber]
					: prev,
		);
	};

	const calculateGap = (driver1: string, driver2: string): string | null => {
		if (!driversTiming) return null;
		const timingDriver1 = driversTiming.lines[driver1];
		const timingDriver2 = driversTiming.lines[driver2];
		if (!timingDriver1 || !timingDriver2) return null;

		const gap1 = parseFloat(timingDriver1.gapToLeader);
		const gap2 = parseFloat(timingDriver2.gapToLeader);

		if (isNaN(gap1) || isNaN(gap2)) return null;

		const gap = gap2 - gap1;

		return gap.toFixed(2);
	};

	return (
		<div className="flex flex-col gap-2 p-0">
			<div className="driver-list flex flex-wrap gap-2">
				{drivers &&
					Object.values(drivers).map((driver) => (
						<button
							key={driver.racingNumber}
							onClick={() => toggleDriverSelection(driver.racingNumber)}
							className={selectedDrivers.includes(driver.racingNumber) ? "selected" : ""}
						>
							<DriverTag className="!min-w-full" short="" short2={driver.tla} teamColor={driver.teamColour} />
						</button>
					))}
			</div>

			<div className="driver-selected">
				{selectedDrivers.map((racingNumber, index) => {
					const timingDriver = driversTiming!.lines[racingNumber];
					const appTimingDriver = driversAppTiming!.lines[racingNumber];
					const timingStatsDriver = driversTimingStats!.lines[racingNumber];
					const carData = carsData ? carsData[racingNumber]?.Channels : undefined;
					return (
						<div key={racingNumber}>
							<DriverBattle
								driver={drivers![racingNumber]}
								timingDriver={timingDriver}
								appTimingDriver={appTimingDriver}
								timingStatsDriver={timingStatsDriver}
								carData={carData}
								position={parseInt(driversTiming!.lines[racingNumber].position, 10)}
								sessionPart={driversTiming!.sessionPart}
							/>

						</div>
					);
				})}
				{/*                {selectedDrivers.length === 2 && (
                    <div className="gap-info">
                        Gap: {calculateGap(selectedDrivers[0], selectedDrivers[1])} seconds
                    </div>
                )}*/}
			</div>
		</div>
	);
};
export default BattleMode;
