import React, { useState, useEffect, memo } from "react";
import { DriverList, TimingData, TimingStats, TimingAppData, CarsData } from "@/types/state.type";
import DriverTag from "@/components/driver/DriverTag";
import DriverBattle from "@/components/driver/DriverBattle";


/**
 * Props for the BattleMode component
 */
type Props = {
	/** List of all drivers in the session */
	drivers: DriverList | undefined;
	/** Timing data for all drivers */
	driversTiming: TimingData | undefined;
	/** Timing statistics for all drivers */
	driversTimingStats: TimingStats | undefined;
	/** Additional timing application data */
	driversAppTiming: TimingAppData | undefined;
	/** Telemetry data for all cars */
	carsData: CarsData | null;
};

/**
 * BattleMode component allows users to select drivers and compare their performance
 * It supports selecting up to 2 drivers and calculates the gap between them
 * Displays selected drivers with their timing and car data
 * 
 * @param props - Component properties
 * @returns A React component for driver comparison
 */
const BattleMode = ({ drivers, driversTiming, driversTimingStats, driversAppTiming, carsData }: Props) => {
	/** Currently selected driver racing numbers */
	const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
	/** Maximum number of drivers that can be selected for comparison */
	const [maxDrivers, setMaxDrivers] = useState<number>(2);

	/**
	 * Toggles the selection state of a driver
	 * If the driver is already selected, they will be deselected
	 * If the driver is not selected and the maximum number of drivers hasn't been reached, they will be selected
	 * 
	 * @param racingNumber - Racing number of the driver to toggle
	 */
	const toggleDriverSelection = (racingNumber: string) => {
		setSelectedDrivers((prev) =>
			prev.includes(racingNumber)
				? prev.filter((num) => num !== racingNumber)
				: prev.length < maxDrivers
					? [...prev, racingNumber]
					: prev,
		);
	};

	/**
	 * Calculates the time gap between two drivers
	 * 
	 * @param driver1 - Racing number of the first driver
	 * @param driver2 - Racing number of the second driver
	 * @returns The time gap as a string with 2 decimal places, or null if the gap cannot be calculated
	 */
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
			</div>
		</div>
	);
};
/**
 * Custom comparison function for React.memo
 * Performs a deep comparison of props to prevent unnecessary re-renders
 * 
 * @param prevProps - Previous component props
 * @param nextProps - Next component props
 * @returns True if the component should not re-render, false otherwise
 */
const arePropsEqual = (prevProps: Props, nextProps: Props): boolean => {
	// Compare drivers
	if (prevProps.drivers !== nextProps.drivers) return false;

	// Compare timing data
	if (prevProps.driversTiming !== nextProps.driversTiming) return false;

	// Compare timing stats
	if (prevProps.driversTimingStats !== nextProps.driversTimingStats) return false;

	// Compare app timing data
	if (prevProps.driversAppTiming !== nextProps.driversAppTiming) return false;

	// Compare cars data
	if (prevProps.carsData !== nextProps.carsData) return false;

	return true;
};

export default memo(BattleMode, arePropsEqual);
