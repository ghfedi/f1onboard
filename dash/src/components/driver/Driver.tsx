"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

import { useMode } from "@/context/ModeContext";

import {
	Driver as DriverType,
	TimingDataDriver,
	TimingAppDataDriver,
	CarDataChannels,
	TimingStatsDriver,
} from "@/types/state.type";

import DriverTag from "./DriverTag";
import DriverDRS from "./DriverDRS";
import DriverGap from "./DriverGap";
import DriverTire from "./DriverTire";
import DriverMiniSectors from "./DriverMiniSectors";
import DriverLapTime from "./DriverLapTime";
import DriverInfo from "./DriverInfo";
import DriverCarMetrics from "./DriverCarMetrics";

/**
 * Props for the Driver component
 */
type Props = {
	/** Current position of the driver in the race/session */
	position: number;
	/** Current part of the session (e.g., 1 for Q1, 2 for Q2, 3 for Q3) */
	sessionPart: number | undefined;
	/** Driver information */
	driver: DriverType;
	/** Timing data for the driver */
	timingDriver: TimingDataDriver;
	/** Timing statistics for the driver */
	timingStatsDriver: TimingStatsDriver | undefined;
	/** Additional timing application data for the driver */
	appTimingDriver: TimingAppDataDriver | undefined;
	/** Telemetry data channels from the car */
	carData: CarDataChannels | undefined;
};

/**
 * Determines if DRS is currently active
 * @param drs - DRS status value from car data
 * @returns True if DRS is active, false otherwise
 */
const hasDRS = (drs: number): boolean => {
	return drs > 9;
};

/**
 * Determines if DRS is available but not currently active
 * @param drs - DRS status value from car data
 * @returns True if DRS is available but not active, false otherwise
 */
const possibleDRS = (drs: number): boolean => {
	return drs === 8;
};

/**
 * Component that displays information about a driver in a race or session
 * Shows driver details, position, DRS status, tire information, and timing data
 *
 * @param props - Component properties
 * @returns A React component displaying driver information
 */
export default function Driver({
	driver,
	timingDriver,
	timingStatsDriver,
	appTimingDriver,
	position,
	sessionPart,
	carData,
}: Props) {
	const { uiElements } = useMode();

	const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;

	return (
		<motion.div
			layout="position"
			className={clsx("flex select-none flex-col gap-1 rounded-md pb-1", {
				"opacity-50": timingDriver.knockedOut || timingDriver.retired || timingDriver.stopped,
				"bg-violet-800 bg-opacity-30": hasFastest,
				"bg-red-800 bg-opacity-30": sessionPart != undefined && inDangerZone(position, sessionPart),
			})}
		>
			<div
				className={clsx("grid items-center gap-2 p-0.5 rounded-s")}
				style={{
					gridTemplateColumns: uiElements.carMetrics
						? "8.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto auto"
						: "8.5rem 4rem 5.5rem 4rem 5rem 5.5rem auto",
					background: `linear-gradient(to right, #${driver.teamColour}, transparent 5%) `,
				}}
			>
				<DriverTag
					className="!min-w-full"
					short2={driver.lastName}
					teamColor={driver.teamColour}
					position={position}
					short={""}
				/>
				<DriverDRS
					on={carData ? hasDRS(carData[45]) : false}
					possible={carData ? possibleDRS(carData[45]) : false}
					inPit={timingDriver.inPit}
					pitOut={timingDriver.pitOut}
				/>
				<DriverTire stints={appTimingDriver?.stints} />
				<DriverInfo timingDriver={timingDriver} gridPos={appTimingDriver ? parseInt(appTimingDriver.gridPos) : 0} />
				<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
				<DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime} hasFastest={hasFastest} />
				<DriverMiniSectors
					sectors={timingDriver.sectors}
					bestSectors={timingStatsDriver?.bestSectors}
					tla={driver.tla}
					showFastest={uiElements.sectorFastest}
				/>

				{uiElements.carMetrics && carData && <DriverCarMetrics carData={carData} />}
			</div>
		</motion.div>
	);
}

/**
 * Determines if a driver is in the elimination zone based on their position and the session part
 * In Q1, positions > 15 are in danger
 * In Q2, positions > 10 are in danger
 * In Q3 or other sessions, no positions are in danger
 *
 * @param position - Current position of the driver
 * @param sessionPart - Current part of the qualifying session (1 for Q1, 2 for Q2, 3 for Q3)
 * @returns True if the driver is in the danger zone, false otherwise
 */
const inDangerZone = (position: number, sessionPart: number): boolean => {
	switch (sessionPart) {
		case 1:
			return position > 15;
		case 2:
			return position > 10;
		case 3:
		default:
			return false;
	}
};
