import { CarDataChannels } from "@/types/state.type";

import SpeedGauge from "@/components/complications/SpeedGauge";
import AnimatedNumber from "../AnimatedNumber";

type Props = {
    carData: CarDataChannels;
};

export default function DriverSpeedometer({ carData }: Props) {
    return (
        <div className="flex size-40 flex-col items-center justify-center">
            <SpeedGauge
                value={carData[0]}
                min={0}
                max={15000}
                size={90}
                strokeWidth={8}
                guideClassName="stroke-gray-500"
                progressClassName="stroke-blue-500"
            />

            <SpeedGauge
                value={5}
                min={0}
                max={10}
                startAngle={-130}
                endAngle={80}
                size={40}
                strokeWidth={8}
                guideClassName="stroke-gray-500"
                progressClassName="stroke-emerald-500"
            />

            <SpeedGauge
                value={!!carData[5] ? 10 : 0}
                min={0}
                max={10}
                startAngle={95}
                endAngle={90}
                size={30}
                strokeWidth={8}
                guideClassName="stroke-gray-500"
                progressClassName="stroke-red-500"
            />

            <AnimatedNumber className="mt-20 text-xs tabular-nums">{carData["2"]}</AnimatedNumber>

            <p className="text-xs">km/h</p>

            <AnimatedNumber className="text-xs">{carData["3"]}</AnimatedNumber>
        </div>
    );
}
