"use client";

import React, { useState } from "react";
import { Driver, TimingDataDriver, TimingStatsDriver, CarDataChannels } from "@/types/state.type";
import { getSectorColorBG, getSectorColorText } from "@/lib/getTimeColor";
import clsx from "clsx";

/**
 * Props for the DriverComparison component
 */
type Props = {
	/** Available drivers to choose from */
	availableDrivers: Driver[];
	/** Timing data for all drivers */
	timingData: { [key: string]: TimingDataDriver };
	/** Timing statistics for all drivers */
	timingStats: { [key: string]: TimingStatsDriver };
	/** Car data for all drivers */
	carData?: { [key: string]: CarDataChannels };
};

/**
 * Component that displays a comparison view for multiple drivers
 * Allows users to select drivers and compare their performance metrics side by side
 */
export default function DriverComparison({
	availableDrivers,
	timingData,
	timingStats,
	carData,
}: Props) {
	const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
	const maxDrivers = 4; // Limit to 4 drivers for better layout

	/**
	 * Handles driver selection/deselection
	 */
	const toggleDriverSelection = (racingNumber: string) => {
		setSelectedDrivers(prev => {
			if (prev.includes(racingNumber)) {
				return prev.filter(num => num !== racingNumber);
			} else if (prev.length < maxDrivers) {
				return [...prev, racingNumber];
			}
			return prev;
		});
	};

	/**
	 * Clears all selected drivers
	 */
	const clearSelection = () => {
		setSelectedDrivers([]);
	};

	/**
	 * Gets the driver data for a racing number
	 */
	const getDriverData = (racingNumber: string) => {
		const driver = availableDrivers.find(d => d.racingNumber === racingNumber);
		const timing = timingData[racingNumber];
		const stats = timingStats[racingNumber];
		const car = carData?.[racingNumber];
		return { driver, timing, stats, car };
	};

	/**
	 * Formats time values for display
	 */
	const formatTime = (value: string | undefined) => {
		return value || "--:---.---";
	};

	/**
	 * Formats speed values for display
	 */
	const formatSpeed = (value: string | undefined) => {
		return value ? `${value} km/h` : "--- km/h";
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="glass rounded-xl p-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-white">Driver Comparison</h2>
					{selectedDrivers.length > 0 && (
						<button
							onClick={clearSelection}
							className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
						>
							Clear Selection
						</button>
					)}
				</div>
				<p className="mt-2 text-sm text-white/60">
					Select up to {maxDrivers} drivers to compare their performance metrics
				</p>
			</div>

			{/* Driver Selection */}
			<div className="glass rounded-xl p-4">
				<h3 className="mb-4 text-lg font-semibold text-white">Select Drivers</h3>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
					{availableDrivers.map(driver => {
						const isSelected = selectedDrivers.includes(driver.racingNumber);
						const isDisabled = !isSelected && selectedDrivers.length >= maxDrivers;

						return (
							<button
								key={driver.racingNumber}
								onClick={() => toggleDriverSelection(driver.racingNumber)}
								disabled={isDisabled}
								className={clsx(
									"rounded-lg border-2 p-3 text-sm font-medium transition-all",
									isSelected
										? "border-blue-500 bg-blue-500/20 text-white"
										: isDisabled
										? "border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed"
										: "border-gray-600 bg-gray-800/50 text-white hover:border-gray-400 hover:bg-gray-700/50"
								)}
								style={{
									...(isSelected && driver.teamColour && {
										borderColor: `#${driver.teamColour}`,
										backgroundColor: `#${driver.teamColour}20`,
									}),
								}}
							>
								<div className="font-bold">{driver.tla}</div>
								<div className="text-xs opacity-75">{driver.lastName}</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Comparison Table */}
			{selectedDrivers.length > 0 && (
				<div className="glass-strong rounded-xl p-4">
					<h3 className="mb-4 text-lg font-semibold text-white">Performance Comparison</h3>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-600">
									<th className="py-3 px-4 text-left text-white font-medium">Metric</th>
									{selectedDrivers.map(racingNumber => {
										const { driver } = getDriverData(racingNumber);
										return (
											<th
												key={racingNumber}
												className="py-3 px-4 text-center text-white font-medium"
												style={{ color: driver?.teamColour ? `#${driver.teamColour}` : undefined }}
											>
												<div className="font-bold">{driver?.tla}</div>
												<div className="text-xs font-normal opacity-75">{driver?.lastName}</div>
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{/* Position */}
								<tr>
									<td className="py-3 px-4 font-medium text-white">Position</td>
									{selectedDrivers.map(racingNumber => {
										const { timing } = getDriverData(racingNumber);
										return (
											<td key={racingNumber} className="py-3 px-4 text-center text-white">
												P{timing?.position || "--"}
											</td>
										);
									})}
								</tr>

								{/* Best Lap Time */}
								<tr>
									<td className="py-3 px-4 font-medium text-white">Best Lap</td>
									{selectedDrivers.map(racingNumber => {
										const { timing } = getDriverData(racingNumber);
										const isFastest = timing?.bestLapTime.position == 1;
										return (
											<td
												key={racingNumber}
												className={clsx(
													"py-3 px-4 text-center font-mono",
													isFastest ? "text-purple-400 font-bold" : "text-white"
												)}
											>
												{formatTime(timing?.bestLapTime?.value)}
											</td>
										);
									})}
								</tr>

								{/* Last Lap Time */}
								<tr>
									<td className="py-3 px-4 font-medium text-white">Last Lap</td>
									{selectedDrivers.map(racingNumber => {
										const { timing } = getDriverData(racingNumber);
										const isPersonalFastest = timing?.lastLapTime?.personalFastest;
										const isOverallFastest = timing?.lastLapTime?.overallFastest;
										return (
											<td
												key={racingNumber}
												className={clsx(
													"py-3 px-4 text-center font-mono",
													isOverallFastest
														? "text-purple-400 font-bold"
														: isPersonalFastest
														? "text-green-400"
														: "text-white"
												)}
											>
												{formatTime(timing?.lastLapTime?.value)}
											</td>
										);
									})}
								</tr>

								{/* Gap to Leader */}
								<tr>
									<td className="py-3 px-4 font-medium text-white">Gap to Leader</td>
									{selectedDrivers.map(racingNumber => {
										const { timing } = getDriverData(racingNumber);
										return (
											<td key={racingNumber} className="py-3 px-4 text-center text-white font-mono">
												{timing?.gapToLeader || "--"}
											</td>
										);
									})}
								</tr>

								{/* Top Speed */}
								<tr>
									<td className="py-3 px-4 font-medium text-white">Top Speed</td>
									{selectedDrivers.map(racingNumber => {
										const { timing } = getDriverData(racingNumber);
										const topSpeed = timing?.speeds?.st?.value || timing?.speeds?.fl?.value;
										return (
											<td key={racingNumber} className="py-3 px-4 text-center text-white font-mono">
												{formatSpeed(topSpeed)}
											</td>
										);
									})}
								</tr>

								{/* Number of Laps */}
								<tr>
									<td className="py-3 px-4 font-medium text-white">Laps Completed</td>
									{selectedDrivers.map(racingNumber => {
										const { timing } = getDriverData(racingNumber);
										return (
											<td key={racingNumber} className="py-3 px-4 text-center text-white">
												{timing?.numberOfLaps || 0}
											</td>
										);
									})}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Sector Comparison */}
			{selectedDrivers.length > 0 && (
				<div className="glass-strong rounded-xl p-4">
					<h3 className="mb-4 text-lg font-semibold text-white">Sector Times Comparison</h3>
					<div className="space-y-4">
						{selectedDrivers.map(racingNumber => {
							const { driver, timing } = getDriverData(racingNumber);
							return (
								<div key={racingNumber} className="space-y-2">
									<div
										className="font-medium text-white"
										style={{ color: driver?.teamColour ? `#${driver.teamColour}` : undefined }}
									>
										{driver?.tla} - {driver?.lastName}
									</div>
									<div className="grid grid-cols-3 gap-2">
										{timing?.sectors?.map((sector, i) => (
											<div key={i} className="space-y-1">
												<div
													className={clsx(
														"h-3 rounded-md",
														getSectorColorBG(sector.overallFastest, sector.personalFastest),
														!sector.value ? "!bg-gray-500" : ""
													)}
												/>
												<p
													className={clsx(
														"text-center text-sm font-mono",
														getSectorColorText(sector.overallFastest, sector.personalFastest),
														!sector.value ? "!text-gray-500" : ""
													)}
												>
													{sector.value || "-- ---"}
												</p>
											</div>
										)) || (
											<div className="col-span-3 text-center text-gray-500">
												No sector data available
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Empty State */}
			{selectedDrivers.length === 0 && (
				<div className="glass-strong rounded-xl p-8 text-center">
					<div className="text-gray-400 text-lg mb-2">No drivers selected</div>
					<div className="text-gray-500 text-sm">
						Select drivers from the list above to start comparing their performance
					</div>
				</div>
			)}
		</div>
	);
}
