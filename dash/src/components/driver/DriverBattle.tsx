"use client";

import { useMode } from "@/context/ModeContext";
import "../BattleMode.css";

import {
	Driver as DriverType,
	TimingDataDriver,
	TimingAppDataDriver,
	CarDataChannels,
	TimingStatsDriver,
} from "@/types/state.type";
import DriverSpeedometer from "./DriverSpeedometer";

import DriverDRS from "./DriverDRS";
import DriverTire from "./DriverTire";
import DriverLapTime from "./DriverLapTime";
import DriverGap from "@/components/driver/DriverGap";
import clsx from "clsx";
import {getSectorColorBG, getSectorColorText} from "@/lib/getTimeColor";


/**
 * Props for the DriverBattle component
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
 * Component that displays detailed battle information for a driver
 * Shows driver details, lap times, tire information, DRS status, and sector performance
 * 
 * @param props - Component properties
 * @returns A React component displaying driver battle information
 */
export default function DriverBattle({
	driver,
	timingDriver,
	timingStatsDriver,
	appTimingDriver,
	position,
	sessionPart,
	carData,
}: Props) {
	const newElement = document.createElement("div");
	const { uiElements } = useMode();

	newElement.id = `driver${driver}`;

	newElement.className = "driver";
	const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;

	return (
		<div className="space-y-4">



					<div className="glass-strong rounded-xl p-4 hover-lift">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center space-x-3">
								<div className="flex items-center space-x-2">
									<div className="text-2xl font-bold text-white">P{position}</div>
									<div className="driver-headshot">
										<img
											id="driver-headshot"
											src={driver.headshotUrl ?? driver.firstName?.replace("1col", "12col") ?? "../icons/unknowndriver.png"}
											alt="Driver Headshot"
										/>
									</div>

								</div>

								<div>
									<div className="text-white font-bold">{driver.lastName}</div>
									<div className="text-white/60 text-sm"
										 style={{...(driver.teamColour && {color: `#${driver.teamColour}`})}}>{driver.teamName}</div>
									</div>
								</div>

								<div className="text-right">
									<div className="text-white font-mono text-sm"><DriverLapTime
										last={timingDriver.lastLapTime} best={timingDriver.bestLapTime}
										hasFastest={hasFastest}/></div>

								</div>
							</div>

							<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-4">

									<div className="text-white/60 text-md ">
										<DriverTire stints={appTimingDriver?.stints} />
									</div>
									<div className="flex items-center text-md space-x-4 w-16 justify-center">
										<DriverDRS
											on={carData ? hasDRS(carData[45]) : false}
											possible={carData ? possibleDRS(carData[45]) : false}
											inPit={timingDriver.inPit}
											pitOut={timingDriver.pitOut}></DriverDRS>
									</div>
								</div >
								{uiElements.carMetrics && carData && <DriverSpeedometer carData={carData} />}

							</div>

							<div className="text-white/60 text-sm">
								<DriverGap timingDriver={timingDriver} sessionPart={sessionPart} />
							</div>

						</div>

						{/* Performance Bar */}
						<div className="mt-3">
							<div className="flex justify-between text-xs text-white/60 mb-1">
								<span>Sectors Performance</span>
														</div>
							<div className="grid grid-cols-3 gap-1">
								{timingDriver.sectors.map((sector, i) => (
									<div className="flex flex-col gap-1" key={`quali.sector.${driver.tla}.${i}`}>
										<div
											className={clsx(
												"h-4 rounded-md",
												getSectorColorBG(sector.overallFastest, sector.personalFastest),
												!sector.value ? "!bg-gray-500" : "",
											)}
										/>
										<p
											className={clsx(
												"text-center text-lg font-semibold leading-none",
												getSectorColorText(sector.overallFastest, sector.personalFastest),
												!sector.value ? "!text-gray-500" : "",
											)}
										>
											{!!sector.value ? sector.value : "-- ---"}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>

		</div>
	);
}
