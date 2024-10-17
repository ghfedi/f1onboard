import React, { useState, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { DriverList, TimingData, TimingStats, TimingAppData, CarsData } from "@/types/state.type";
import Driver from "@/components/driver/Driver";
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
    const [maxDrivers, setMaxDrivers] = useState<number>(20);



    const toggleDriverSelection = (racingNumber: string) => {
        setSelectedDrivers((prev) =>
            prev.includes(racingNumber)
                ? prev.filter((num) => num !== racingNumber)
                : prev.length < maxDrivers
                    ? [...prev, racingNumber]
                    : prev
        );
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
                        <DriverTag className="!min-w-full" short={driver.tla} teamColor={driver.teamColour}/>
                    </button>
                ))}
            </div>
            <div className="driver-info">
                {selectedDrivers.map((racingNumber,index) => {
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
            </div>
        </div>
    );
};

export default BattleMode;
