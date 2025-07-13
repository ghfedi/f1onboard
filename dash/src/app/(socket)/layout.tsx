"use client";

import { ReactNode, useEffect, useState } from "react";
import { clsx } from "clsx";

import { env } from "@/env.mjs";

import { inflate } from "@/lib/inflate";

import { MessageData } from "@/types/message.type";
import { State } from "@/types/state.type";

import { SocketProvider, useSocket } from "@/context/SocketContext";
import { ModeProvider, useMode } from "@/context/ModeContext";
import { WindowsProvider } from "@/context/WindowsContext";

import Menubar from "@/components/Menubar";
import DelayInput from "@/components/DelayInput";
import PlayControls from "@/components/PlayControls";
import StreamStatus from "@/components/StreamStatus";
import SegmentedControls from "@/components/SegmentedControls";
import { SpeedPreferenceProvider, useSpeedPreference } from "@/context/SpeedPreferenceContext";

type Props = {
	children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
	return (
		<SocketProvider>
			<ModeProvider>
				<WindowsProvider>
					<SpeedPreferenceProvider>
						<SubLayout>{children}</SubLayout>
					</SpeedPreferenceProvider>
				</WindowsProvider>
			</ModeProvider>
		</SocketProvider>
	);
}

const SubLayout = ({ children }: Props) => {
	const { handleMessage, handleInitial, setConnected, setDelay, delay, maxDelay, pause, resume } = useSocket();
	const { mode, setMode } = useMode();

	useEffect(() => {
		const sse = new EventSource(`${env.NEXT_PUBLIC_LIVE_SOCKET_URL}/api/sse`);

		sse.onerror = () => setConnected(false);
		sse.onopen = () => setConnected(true);

		sse.addEventListener("initial", (message) => {
			const decompressed = inflate<State>(message.data);
			handleInitial(decompressed);
		});

		sse.addEventListener("update", (message) => {
			const decompressed = inflate<MessageData>(message.data);
			handleMessage(decompressed);
		});

		return () => sse.close();
	}, []);

	const [pausedTime, setPausedTime] = useState<number>(0);
	const [playback, setPlayback] = useState<boolean>(true);

	const togglePlayback = () => {
		setPlayback((old) => {
			if (old) {
				setPausedTime(Date.now());
				pause();
			} else {
				setDelay(Math.round((Date.now() - pausedTime) / 1000) + delay);
				resume();
			}

			return !old;
		});
	};

	const setDelayProxy = (newDelay: number) => {
		if (newDelay === 0) {
			resume();
			setPausedTime(0);
		}

		setDelay(newDelay);

		if (typeof window != undefined) {
			localStorage.setItem("delay", `${newDelay}`);
		}
	};

	const syncing = maxDelay < delay;

	return (
		<div className="min-h-screen relative overflow-hidden">
			<style>{`
        :root {
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --glass-shadow: rgba(0, 0, 0, 0.1);
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 32px var(--glass-shadow);
        }
        
        .glass-strong {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .gradient-bg {

background: linear-gradient(135deg,#030712, #030712);
        }
        
   
      `}</style>
			{/* Animated Background */}
			<div className=" gradient-bg">


			<div className="grid grid-cols-1 relative items-center gap-4 p-2 md:grid-cols-2 ">
				<Menubar />

				<div className="flex relative items-center gap-2 sm:hidden">
					{/* <Timeline setTime={setTime} time={time} playing={delay.current > 0} maxDelay={maxDelay} /> */}
					<DelayInput className="flex md:hidden" delay={delay} setDebouncedDelay={setDelayProxy} />
					<PlayControls className="flex md:hidden" playing={playback} onClick={() => togglePlayback()} />
					<StreamStatus live={delay == 0} />
				</div>

				<div className="flex relative flex-row-reverse flex-wrap-reverse items-center gap-1">
					<SegmentedControls
						id="mode"
						className="w-full md:w-auto"
						selected={mode}
						onSelect={setMode}
						options={[
							{ label: "Simple", value: "simple" },
							{ label: "Advanced", value: "advanced" },
							{ label: "Expert", value: "expert" },
							{ label: "Custom", value: "custom" },
						]}
					/>
					<DelayInput className="hidden md:flex" delay={delay} setDebouncedDelay={setDelayProxy} />
					<PlayControls className="hidden md:flex" playing={playback} onClick={() => togglePlayback()} />
				</div>
			</div>

			{syncing && (
				<div className="flex w-full flex-col items-center justify-center">
					<h1 className="my-20 text-center text-5xl font-bold">Syncing...</h1>
					<p>Please wait for {delay - maxDelay} seconds.</p>
					<p>Or make your delay smaller.</p>
				</div>
			)}

			<div className={clsx("h-max w-full", syncing && "hidden")}>{children}</div>
		</div></div>
	);
};
