import { AnimatePresence, LayoutGroup } from "framer-motion";
import clsx from "clsx";
import React, { memo, useMemo } from "react";
import { FixedSizeList as List } from "react-window";

import { sortPos } from "@/lib/sorting/sortPos";
import { objectEntries } from "@/lib/driverHelper";

import { useMode } from "@/context/ModeContext";

import { CarsData, DriverList, TimingAppData, TimingData, TimingStats } from "@/types/state.type";

import Driver from "@/components/driver/Driver";

type Props = {
	drivers: DriverList | undefined;
	driversTiming: TimingData | undefined;
	driversTimingStats: TimingStats | undefined;
	driversAppTiming: TimingAppData | undefined;
	carsData: CarsData | null;
};

function LeaderBoard({ drivers, driversTiming, driversTimingStats, driversAppTiming, carsData }: Props) {
	const { uiElements } = useMode();

	// Memoize the sorted drivers list to avoid unnecessary recalculations
	const sortedDrivers = useMemo(() => {
		if (!drivers || !driversTiming) return [];
		return objectEntries(driversTiming.lines).sort(sortPos);
	}, [drivers, driversTiming]);

	// Define the height of each driver row (adjust based on your actual row height)
	const ITEM_HEIGHT = 80; // Approximate height in pixels
	const MAX_VISIBLE_ITEMS = 10; // Maximum number of items to show before scrolling
	const listHeight = Math.min(sortedDrivers.length * ITEM_HEIGHT, MAX_VISIBLE_ITEMS * ITEM_HEIGHT);

	// Render function for each virtualized item
	const renderDriverItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
		const timingDriver = sortedDrivers[index];
		return (
			<div style={style}>
				<Driver
					key={`leaderBoard.driver.${timingDriver.racingNumber}`}
					driver={drivers![timingDriver.racingNumber]}
					timingDriver={timingDriver}
					appTimingDriver={driversAppTiming?.lines[timingDriver.racingNumber]}
					timingStatsDriver={driversTimingStats?.lines[timingDriver.racingNumber]}
					position={index + 1}
					sessionPart={driversTiming!.sessionPart}
					carData={carsData ? carsData[timingDriver.racingNumber].Channels : undefined}
				/>
			</div>
		);
	};

	return (
		<div className="hover-lift overflow-hidden">
			{uiElements.tableHeaders && <TableHeaders />}

			{(!drivers || !driversTiming) &&
				new Array(20).fill("").map((_, index) => <SkeletonDriver key={`driver.loading.${index}`} />)}

			<LayoutGroup key="drivers">
				{drivers && driversTiming && sortedDrivers.length > 0 && (
					<AnimatePresence>
						{sortedDrivers.length <= 20 ? (
							// For small lists (≤20 items), render normally without virtualization
							sortedDrivers.map((timingDriver, index) => (
								<Driver
									key={`leaderBoard.driver.${timingDriver.racingNumber}`}
									driver={drivers[timingDriver.racingNumber]}
									timingDriver={timingDriver}
									appTimingDriver={driversAppTiming?.lines[timingDriver.racingNumber]}
									timingStatsDriver={driversTimingStats?.lines[timingDriver.racingNumber]}
									position={index + 1}
									sessionPart={driversTiming.sessionPart}
									carData={carsData ? carsData[timingDriver.racingNumber].Channels : undefined}
								/>
							))
						) : (
							// For large lists (>20 items), use virtualization
							<List
								height={listHeight}
								itemCount={sortedDrivers.length}
								itemSize={ITEM_HEIGHT}
								width="100%"
								className="virtualized-leaderboard"
							>
								{renderDriverItem}
							</List>
						)}
					</AnimatePresence>
				)}
			</LayoutGroup>
		</div>
	);
}

const TableHeaders = () => {
	return (
		<div className="grid grid-cols-[auto_4px_1fr_auto_auto_auto_auto] gap-x-4 border-b border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase text-white/60">
			<p>Position</p>
			<p>DRS</p>
			<p>Tire</p>
			<p>Info</p>
			<p>Gap</p>
			<p>LapTime</p>
			<p>Sectors</p>
		</div>
	);
};

const SkeletonDriver = () => {
	const animateClass = "h-8 animate-pulse rounded-md";

	return (
		<div className="grid grid-cols-[auto_4px_1fr_auto_auto_auto_auto] items-center gap-x-4 border-b border-white/10 px-4 py-3 transition-colors duration-200 last:border-b-0 hover:bg-white/5">
			<div className={animateClass} style={{ width: "100%" }} />

			<div className={animateClass} style={{ width: "90%" }} />

			<div className="flex w-full gap-2">
				<div className={clsx(animateClass, "w-8")} />

				<div className="flex flex-1 flex-col gap-1">
					<div className={clsx(animateClass, "!h-4")} />
					<div className={clsx(animateClass, "!h-3 w-2/3")} />
				</div>
			</div>

			{new Array(2).fill(null).map((_, index) => (
				<div className="flex w-full flex-col gap-1" key={`skeleton.${index}`}>
					<div className={clsx(animateClass, "!h-4")} />
					<div className={clsx(animateClass, "!h-3 w-2/3")} />
				</div>
			))}

			<div className="flex w-full flex-col gap-1">
				<div className={clsx(animateClass, "!h-3 w-4/5")} />
				<div className={clsx(animateClass, "!h-4")} />
			</div>

			<div className="flex w-full gap-1">
				{new Array(3).fill(null).map((_, index) => (
					<div className="flex w-full flex-col gap-1" key={`skeleton.sector.${index}`}>
						<div className={clsx(animateClass, "!h-4")} />
						<div className={clsx(animateClass, "!h-3 w-2/3")} />
					</div>
				))}
			</div>
		</div>
	);
};

/**
 * Custom comparison function for React.memo
 * Performs a comparison of props to prevent unnecessary re-renders
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
	return prevProps.carsData === nextProps.carsData;


};

export default memo(LeaderBoard, arePropsEqual);
