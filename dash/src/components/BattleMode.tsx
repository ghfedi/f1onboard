import React, { useState, useEffect } from "react";
import { DriverList, TimingData, TimingStats, TimingAppData, CarsData } from "@/types/state.type";
import DriverTag from "@/components/driver/DriverTag";
import DriverBattle from "@/components/driver/DriverBattle";

type Props = {
    drivers: DriverList | undefined;
    driversTiming: TimingData | undefined;
    driversTimingStats: TimingStats | undefined;
    driversAppTiming: TimingAppData | undefined;
    carsData: CarsData | null;
};

const BattleMode = ({ drivers, driversTiming, driversTimingStats, driversAppTiming, carsData }: Props) => {
    const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
    const [maxDrivers, setMaxDrivers] = useState<number>(3);

    const toggleDriverSelection = (racingNumber: string) => {
        setSelectedDrivers((prev) =>
            prev.includes(racingNumber)
                ? prev.filter((num) => num !== racingNumber)
                : prev.length < maxDrivers
                    ? [...prev, racingNumber]
                    : prev
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
        <div className="battle-mode">
            <div className="driver-selection">
                {drivers && Object.values(drivers).map((driver) => (
                    <button
                        key={driver.racingNumber}
                        onClick={() => toggleDriverSelection(driver.racingNumber)}
                        className={selectedDrivers.includes(driver.racingNumber) ? "selected" : ""}
                    >
                        <DriverTag className="!min-w-full" short={driver.firstName} short2={driver.lastName} teamColor={driver.teamColour}/>
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
                        <DriverBattle
                            key={racingNumber}
                            driver={drivers![racingNumber]}
                            timingDriver={timingDriver}
                            appTimingDriver={appTimingDriver}
                            timingStatsDriver={timingStatsDriver}
                            carData={carData}
                            position={parseInt(driversTiming!.lines[racingNumber].position, 10)}
                            sessionPart={driversTiming!.sessionPart}/>


                    );
                })}
                {selectedDrivers.length === 2 && (
                    <div className="gap-info">
                        Gap: {calculateGap(selectedDrivers[0], selectedDrivers[1])} seconds
                    </div>
                )}
            </div>
        </div>
    );
};
export default BattleMode;
