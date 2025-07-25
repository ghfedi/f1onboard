"use client";

import clsx from "clsx";

import { useSocket } from "@/context/SocketContext";

import SessionInfo from "@/components/SessionInfo";
import WeatherInfo from "@/components/WeatherInfo";
import TrackInfo from "@/components/TrackInfo";
import LeaderBoard from "@/components/LeaderBoard";
import Qualifying from "@/components/Qualifying";
import RaceControl from "@/components/RaceControl";
import TeamRadios from "@/components/TeamRadios";
import Map from "@/components/Map";
import LapCount from "@/components/LapCount";
import BattleMode from "@/components/BattleMode";
import FastestLapOverlay from "@/components/FastestLapOverlay";
import { DriverList, TimingData, TimingStats, TimingAppData, CarsData, Driver } from "@/types/state.type";

export default function Page() {
	const { state, positions, carsData } = useSocket();
	const driversTimingStats: TimingStats | undefined = state?.timingStats;
	const fastestLapDriver = Object.values(driversTimingStats?.lines || {}).find(
		(driver) => driver.personalBestLapTime.position === 1,
	);
	const fastestdriver =
		fastestLapDriver?.racingNumber !== undefined ? state?.driverList?.[fastestLapDriver.racingNumber] : undefined;

	return (
		<div className="relative flex w-full flex-col">
			{/* md upwards, desktop ipad design */}
			<div className="hidden flex-wrap items-center justify-between gap-2 overflow-hidden p-2 px-2 md:flex">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex w-full items-center justify-between md:w-auto">
						<SessionInfo session={state?.sessionInfo} clock={state?.extrapolatedClock} timingData={state?.timingData} />
					</div>

					<WeatherInfo weather={state?.weatherData} />
				</div>
				<div className="flex w-full items-center justify-between md:w-auto">
					<FastestLapOverlay
						fastestLapDriver={fastestLapDriver}
						latestRaceControlMessage={state?.raceControlMessages?.messages?.[0]}
						fastestdriver={fastestdriver as Driver | undefined}
					/>
				</div>
				<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
			</div>

			{/* sm, mobile design */}
			<div className="flex w-full flex-col divide-y divide-zinc-800 border-b border-zinc-800 md:hidden">
				<div className="p-2">
					<SessionInfo session={state?.sessionInfo} clock={state?.extrapolatedClock} timingData={state?.timingData} />
				</div>

				<div className="p-2">
					<WeatherInfo weather={state?.weatherData} />
				</div>

				<div className="flex justify-between overflow-hidden p-4">
					<TrackInfo track={state?.trackStatus} lapCount={state?.lapCount} />
					<LapCount lapCount={state?.lapCount} />
				</div>
			</div>

			<div className={clsx("flex w-full flex-col divide-y")}>
				<div className={clsx("flex w-full flex-col divide-y divide-zinc-800", "xl:flex-row xl:divide-x xl:divide-y-0")}>
					<div className={clsx("mb-2 overflow-x-auto md:overflow-visible", "xl:flex-[0,0,auto]")}>
						<div className="hover-lift overflow-hidden rounded-md">
							<LeaderBoard
								drivers={state?.driverList}
								driversTiming={state?.timingData}
								driversTimingStats={state?.timingStats}
								driversAppTiming={state?.timingAppData}
								carsData={carsData}
							/>
						</div>
					</div>

					<div className={clsx("flex flex-col divide-y divide-zinc-800", "xl:min-w-0 xl:flex-grow")}>
						<div className="overflow-x-auto">
							<BattleMode
								drivers={state?.driverList}
								driversTiming={state?.timingData}
								driversTimingStats={state?.timingStats}
								driversAppTiming={state?.timingAppData}
								carsData={carsData}
							/>
							{/*<Qualifying*/}
							{/*	drivers={state?.driverList}*/}
							{/*	driversTiming={state?.timingData}*/}
							{/*	appDriversTiming={state?.timingAppData}*/}
							{/*/>*/}
						</div>

						<div className="hidden w-full xl:block">
							<Map
								circuitKey={state?.sessionInfo?.meeting.circuit.key}
								positions={positions}
								drivers={state?.driverList}
								timingDrivers={state?.timingData}
								trackStatus={state?.trackStatus}
								raceControlMessages={state?.raceControlMessages?.messages}
							/>
						</div>

						<div
							className={clsx(
								"flex w-full flex-col divide-y divide-zinc-800",
								"md:min-w-0 md:flex-row md:divide-x md:divide-y-0",
								"xl:flex-1 xl:flex-col xl:divide-x-0 xl:divide-y xl:pl-2",
								"2xl:min-w-0 2xl:flex-row 2xl:divide-x 2xl:divide-y-0",
							)}
						>
							<div
								className={clsx(
									"h-96 overflow-y-auto p-2",
									"md:w-1/2",
									"xl:auto xl:mr-0 xl:w-auto xl:flex-grow",
									"2xl:w-1/2",
								)}
							>
								<RaceControl messages={state?.raceControlMessages} utcOffset={state?.sessionInfo?.gmtOffset ?? ""} />
							</div>

							<div
								className={clsx(
									"h-96 overflow-y-auto p-2",
									"md:w-1/2",
									"xl:auto xl:mr-0 xl:w-auto xl:flex-grow",
									"2xl:w-1/2",
								)}
							>
								<TeamRadios
									sessionPath={state?.sessionInfo?.path}
									drivers={state?.driverList}
									teamRadios={state?.teamRadio}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="md:hidden">
					<Map
						circuitKey={state?.sessionInfo?.meeting.circuit.key}
						positions={positions}
						drivers={state?.driverList}
						timingDrivers={state?.timingData}
						trackStatus={state?.trackStatus}
						raceControlMessages={state?.raceControlMessages?.messages}
					/>
				</div>
			</div>

			<div className="px-2"></div>
		</div>
	);
}
