"use client";

import {
	motion,
	useMotionValue,
	useDragControls,
	AnimatePresence,

} from "framer-motion";

import { useState, useRef, useEffect, MutableRefObject, Dispatch, SetStateAction, memo } from "react";
import React from "react";

/**
 * Calculates the progress (0-1) based on the x-coordinate relative to a container
 * 
 * @param x - The x-coordinate of the point
 * @param containerRef - Reference to the container element
 * @returns Progress value between 0 and 1
 */
function getProgressFromX({ x, containerRef }: { x: number; containerRef: MutableRefObject<any> }): number {
	let bounds = containerRef.current.getBoundingClientRect();
	let progress = (x - bounds.x) / bounds.width;
	return clamp(progress, 0, 1);
}

/**
 * Calculates the x-coordinate based on a progress value (0-1) relative to a container
 * 
 * @param progress - Progress value between 0 and 1
 * @param containerRef - Reference to the container element
 * @returns The x-coordinate corresponding to the progress
 */
function getXFromProgress({ progress, containerRef }: { progress: number; containerRef: MutableRefObject<any> }): number {
	let bounds = containerRef.current.getBoundingClientRect();
	return progress * bounds.width;
}

/**
 * Constrains a number to be within a specified range
 * 
 * @param number - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped number
 */
function clamp(number: number, min: number, max: number): number {
	return Math.max(min, Math.min(number, max));
}

/**
 * Custom hook for setting up an interval that can be paused
 * 
 * @param callback - Function to call on each interval
 * @param delay - Interval delay in milliseconds, or null to pause
 * @returns Reference to the interval
 */
function useInterval(callback: () => void, delay: number | null): React.MutableRefObject<number | null> {
	const intervalRef = useRef<null | number>(null);
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		const tick = () => savedCallback.current();
		if (typeof delay === "number") {
			intervalRef.current = window.setInterval(tick, delay);
			return () => {
				if (intervalRef.current) {
					window.clearInterval(intervalRef.current);
				}
			};
		}
	}, [delay]);

	return intervalRef;
}

/**
 * Props for the Timeline component
 */
type Props = {
	/** Function to update the current time */
	setTime: Dispatch<SetStateAction<number>>;
	/** Current time in seconds */
	time: number;
	/** Whether the timeline is currently playing */
	playing: boolean;
	/** Maximum duration in seconds */
	maxDelay: number;
};

/**
 * A timeline component with a draggable scrubber for controlling playback
 * 
 * @param props - Component properties
 * @returns A React component for timeline control
 */
function Timeline({ playing, maxDelay, time, setTime }: Props) {
	const DURATION = maxDelay;

	let [dragging, setDragging] = useState(false);
	let constraintsRef = useRef<HTMLDivElement | null>(null);
	let fullBarRef = useRef<null | HTMLDivElement>(null);
	let scrubberRef = useRef<null | HTMLButtonElement>(null);
	let scrubberX = useMotionValue(0);
	let currentTimePrecise = useMotionValue(time);
	let dragControls = useDragControls();

	let mins = Math.floor(time / 60);
	let secs = `${time % 60}`.padStart(2, "0");
	let timecode = `${mins}:${secs}`;

	useInterval(
		() => {
			if (time < DURATION) {
				setTime((t) => t + 1);
			}
		},
		playing ? 1000 : null,
	);

	useInterval(
		() => {
			if (time < DURATION) {
				currentTimePrecise.set(currentTimePrecise.get() + 0.01);
				let newX = getXFromProgress({
					containerRef: fullBarRef,
					progress: currentTimePrecise.get() / DURATION,
				});
				scrubberX.set(newX);
			}
		},
		playing ? 10 : null,
	);

	return (
		<div className="relative w-full select-none">
			<div
				className="relative"
				onPointerDown={(event) => {
					let newProgress = getProgressFromX({
						containerRef: fullBarRef,
						x: event.clientX,
					});
					dragControls.start(event, { snapToCursor: true });
					setTime(Math.floor(newProgress * DURATION));
					currentTimePrecise.set(newProgress * DURATION);
				}}
			>
				<div ref={fullBarRef} className="h-1 w-full rounded-full bg-zinc-800" />

				<div className="absolute inset-0" ref={constraintsRef}>
					<motion.button
						className="absolute flex cursor-ew-resize items-center justify-center rounded-full active:cursor-grabbing"
						ref={scrubberRef}
						drag="x"
						dragConstraints={constraintsRef}
						dragControls={dragControls}
						dragElastic={0}
						dragMomentum={false}
						style={{ x: scrubberX }}
						onDrag={() => {
							if (!scrubberRef.current) return;
							const scrubberBounds = scrubberRef.current.getBoundingClientRect();
							const middleOfScrubber = scrubberBounds.x + scrubberBounds.width / 2;
							const newProgress = getProgressFromX({
								containerRef: fullBarRef,
								x: middleOfScrubber,
							});
							setTime(Math.floor(newProgress * DURATION));
							currentTimePrecise.set(newProgress * DURATION);
						}}
						onDragStart={() => setDragging(true)}
						onPointerDown={() => setDragging(true)}
						onPointerUp={() => setDragging(false)}
						onDragEnd={() => setDragging(false)}
					>
						<motion.div
							animate={{ scale: dragging ? 1.2 : 1 }}
							transition={{ type: "tween", duration: 0.15 }}
							initial={false}
							className="-mt-2 h-5 w-2 rounded-full bg-zinc-300"
						/>

						<AnimatePresence>
							{dragging && (
								// TODO add background blur so you can always see the time
								<motion.p
									className="absolute text-sm font-medium tabular-nums tracking-wide"
									initial={{ y: 12, opacity: 0 }}
									animate={{ y: 20, opacity: 1 }}
									exit={{ y: [20, 12], opacity: 0 }}
								>
									{timecode}
								</motion.p>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</div>
		</div>
	);
}

/**
 * Custom comparison function for React.memo
 * Performs a comparison of props to prevent unnecessary re-renders
 * 
 * @param prevProps - Previous component props
 * @param nextProps - Next component props
 * @returns True if the component should not re-render, false otherwise
 */
const arePropsEqual = (prevProps: Props, nextProps: Props): boolean => {
	// Compare playing state
	if (prevProps.playing !== nextProps.playing) return false;

	// Compare maxDelay
	if (prevProps.maxDelay !== nextProps.maxDelay) return false;

	// Compare time
	if (prevProps.time !== nextProps.time) return false;

	// We don't compare setTime function as it's unlikely to change
	// and comparing functions is generally not reliable

	return true;
};

export default memo(Timeline, arePropsEqual);
