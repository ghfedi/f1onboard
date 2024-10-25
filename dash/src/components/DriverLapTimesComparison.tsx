import React from "react";
import { TimingDataDriver } from "@/types/state.type";

type Props = {
    driver: TimingDataDriver;
};

const DriverLapTimesComparison = ({ driver }: Props) => {
    console.log(driver.lastLapTime)
    return (
        <div className="lap-times-comparison">
            <table className="min-w border border-gray-200">
                <thead>
                <tr>
                    <th className="px-2 py-0 border-b">Lap</th>
                    <th className="px-4 py-2 border-b">Time</th>
                </tr>
                </thead>
                <tbody>
                {driver.stats?.map((stat, index) => (
                    <tr key={index} className="even:bg-gray-100">
                        <td className="px-2 py-0 border-b">{index + 1}</td>
                        <td className="px-4 py-2 border-b">{stat.timeDiffToFastest}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DriverLapTimesComparison;
