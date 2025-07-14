import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { utc } from "moment";

import DriverTag from "./driver/DriverTag";
import PlayControls from "./PlayControls";
import AudioProgress from "./AudioProgress";

import { Driver, RadioCapture } from "@/types/state.type";

type Props = {
	driver: Driver;
	capture: RadioCapture;
	basePath: string;
};

export default function TeamRadioMessage({ driver, capture, basePath }: Props) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const [playing, setPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(10);
	const [progress, setProgress] = useState<number>(0);

	const loadMeta = () => {
		if (!audioRef.current) return;
		setDuration(audioRef.current.duration);
	};

	const onEnded = () => {
		setPlaying(false);
		setProgress(0);

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	const updateProgress = () => {
		if (!audioRef.current) return;
		setProgress(audioRef.current.currentTime);
	};

	const togglePlayback = () => {
		setPlaying((old) => {
			if (!audioRef.current) return old;

			if (!old) {
				audioRef.current.play();
				intervalRef.current = setInterval(updateProgress, 10);
			} else {
				audioRef.current.pause();

				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}

				setTimeout(() => {
					setProgress(0);
					audioRef.current?.fastSeek(0);
				}, 10000);
			}

			return !old;
		});
	};

	return (
		<motion.li
			animate={{ opacity: 1, y: 0 }}
			initial={{ opacity: 0, y: -20 }}
			className="flex flex-col gap-1"
			style={{ background: `linear-gradient(to right, #${driver.teamColour}, transparent 90%) ` }}
		>
			<div
				className="grid place-items-center items-center gap-1"
				style={{
					gridTemplateColumns: "2rem 20rem",
				}}
			>
				<div className="w-10 flex-col items-center justify-center place-self-start">
					<DriverTag short2={driver.tla} short={""} teamColor={""} />
					<div className="size-12 rounded-full">
						<img
							id="driver-headshot"
							src={driver.headshotUrl ?? driver.firstName?.replace("1col", "12col") ?? "../icons/unknowndriver.png"}
							alt="Driver Headshot"
						/>
					</div>
				</div>

				<div className="flex items-center gap-1">
					<PlayControls playing={playing} onClick={togglePlayback} />
					<AudioProgress duration={duration} progress={progress} />

					<audio
						preload="none"
						src={`${basePath}${capture.path}`}
						ref={audioRef}
						onEnded={() => onEnded()}
						onLoadedMetadata={() => loadMeta()}
					/>
					<time
						className="text-sm font-medium leading-none text-white"
						dateTime={utc(capture.utc).local().format("HH:mm:ss")}
					>
						{utc(capture.utc).local().format("HH:mm:ss")}
					</time>
				</div>
			</div>
		</motion.li>
	);
}
