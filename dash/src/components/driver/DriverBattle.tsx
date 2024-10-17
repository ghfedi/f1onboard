"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useMode } from "@/context/ModeContext";
import '../BattleMode.css';

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

type Props = {
    position: number;
    sessionPart: number | undefined;
    driver: DriverType;
    timingDriver: TimingDataDriver;
    timingStatsDriver: TimingStatsDriver | undefined;
    appTimingDriver: TimingAppDataDriver | undefined;
    carData: CarDataChannels | undefined;
};

const hasDRS = (drs: number) => {
    return drs > 9;
};

const possibleDRS = (drs: number) => {
    return drs === 8;
};

export default function DriverBattle({	driver,
                                   timingDriver,
                                   timingStatsDriver,
                                   appTimingDriver,
                                   position,
                                   sessionPart,
                                   carData,}: Props) {

    const { uiElements } = useMode();
    const newElement = document.createElement("div");

    newElement.id = `driver${driver}`;

    newElement.className = "driver";
    const hasFastest = timingStatsDriver?.personalBestLapTime.position == 1;
    return (


        <div className="driver-info">
            <div className="flex flex-col gap-2">


                <div className="driver-headshot">
                    <img
                        id="driver-headshot"
                        src={driver.headshotUrl ?? driver.firstName?.replace("1col", "12col") ?? "../icons/unknowndriver.png"}
                        alt="Driver Headshot"
                    />

                </div>
                <DriverTag short={driver.tla} teamColor={driver.teamColour} position={position}/>
            </div>
            {/*<div className="driver-name">
                        <div className="first-name"><p id="first-name">{driver.firstName}</p></div>
                        <div className="last-name"><p id="last-name" style={{color: `#${driver.teamColour}`}}>
                            {driver.lastName}
                        </p></div>
                    </div>*/}
            <div className="flex flex-col gap-2">
                <DriverDRS
                    on={carData ? hasDRS(carData[45]) : false}
                    possible={carData ? possibleDRS(carData[45]) : false}
                    inPit={timingDriver.inPit}
                    pitOut={timingDriver.pitOut}
                />
                <DriverTire stints={appTimingDriver?.stints}/>
                <DriverLapTime last={timingDriver.lastLapTime} best={timingDriver.bestLapTime}
                               hasFastest={hasFastest}/>

            </div>

            {uiElements.carMetrics && carData && <DriverCarMetrics carData={carData}/>}
        </div>


    )
        ;


}
