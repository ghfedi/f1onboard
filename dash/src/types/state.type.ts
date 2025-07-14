/**
 * Represents a partial update to the application state
 */
export type Update = RecursivePartial<State>;

/**
 * Utility type that makes all properties of T optional recursively
 * Used for partial updates to nested objects
 */
type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
			? RecursivePartial<T[P]>
			: T[P];
};

/**
 * Main application state containing all race and session data
 */
export type State = {
	/** Heartbeat information for synchronization */
	heartbeat?: Heartbeat;
	/** Clock information with extrapolated time remaining */
	extrapolatedClock?: ExtrapolatedClock;
	/** Information about the top three drivers */
	topThree?: TopThree;
	/** Timing statistics for all drivers */
	timingStats?: TimingStats;
	/** Additional timing application data */
	timingAppData?: TimingAppData;
	/** Current weather conditions */
	weatherData?: WeatherData;
	/** Current track status information */
	trackStatus?: TrackStatus;
	/** List of all drivers in the session */
	driverList?: DriverList;
	/** Messages from race control */
	raceControlMessages?: RaceControlMessages;
	/** Information about the current session */
	sessionInfo?: SessionInfo;
	/** Data related to the current session */
	sessionData?: SessionData;
	/** Current lap count information */
	lapCount?: LapCount;
	/** Timing data for all drivers */
	timingData?: TimingData;
	/** Team radio communications */
	teamRadio?: TeamRadio;

	/** Compressed car data (internal use) */
	carDataZ?: string;
	/** Compressed position data (internal use) */
	positionZ?: string;
};

/**
 * Heartbeat information for synchronization
 */
export type Heartbeat = {
	/** UTC timestamp of the heartbeat */
	utc: string;
};

/**
 * Clock information with extrapolated time remaining
 */
export type ExtrapolatedClock = {
	/** UTC timestamp of the clock */
	utc: string;
	/** Remaining time in the session */
	remaining: string;
	/** Whether the clock is being extrapolated */
	extrapolating: boolean;
};

export type TopThree = {
	withheld: boolean;
	lines: TopThreeDriver[];
};

export type TimingStats = {
	withheld: boolean;
	lines: {
		[key: string]: TimingStatsDriver;
	};
	sessionType: string;
	_kf: boolean;
};

export type TimingAppData = {
	lines: {
		[key: string]: TimingAppDataDriver;
	};
};

export type TimingAppDataDriver = {
	racingNumber: string;
	stints: Stint[];
	line: number;
	gridPos: string;
};

export type Stint = {
	totalLaps?: number;
	compound?: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
	new?: string; // TRUE | FALSE
};

export type WeatherData = {
	airTemp: string;
	humidity: string;
	pressure: string;
	rainfall: string;
	trackTemp: string;
	windDirection: string;
	windSpeed: string;
};

export type TrackStatus = {
	status: string;
	message: string;
};

/**
 * Collection of drivers indexed by racing number
 */
export type DriverList = {
	[key: string]: Driver;
};

/**
 * Information about a Formula 1 driver
 */
export type Driver = {
	/** Unique racing number of the driver */
	racingNumber: string;
	/** Name used in broadcasts */
	broadcastName: string;
	/** Full name of the driver */
	fullName: string;
	/** Three-letter abbreviation (e.g., HAM, VER) */
	tla: string;
	/** Line number for display order */
	line: number;
	/** Name of the team */
	teamName: string;
	/** Hex color code for the team (without #) */
	teamColour: string;
	/** First name of the driver */
	firstName: string;
	/** Last name of the driver */
	lastName: string;
	/** Reference identifier */
	reference: string;
	/** URL to the driver's headshot image */
	headshotUrl: string;
	/** ISO country code for the driver's nationality */
	countryCode: string;
};

export type RaceControlMessages = {
	messages: Message[];
};

export type Message = {
	utc: string;
	lap: number;
	message: string;
	category: "Other" | "Sector" | "Flag" | "Drs" | "SafetyCar" | string;
	flag?: "BLACK AND WHITE" | "BLUE" | "CLEAR" | "YELLOW" | "GREEN" | "DOUBLE YELLOW" | "RED";
	scope?: "Driver" | "Track" | "Sector";
	sector?: number;
	status?: "ENABLED" | "DISABLED";
};

export type SessionInfo = {
	meeting: Meeting;
	archiveStatus: ArchiveStatus;
	key: number;
	type: string;
	name: string;
	startDate: string;
	endDate: string;
	gmtOffset: string;
	path: string;
	number?: number;
};

export type ArchiveStatus = {
	status: string;
};

export type Meeting = {
	key: number;
	name: string;
	officialName: string;
	location: string;
	country: Country;
	circuit: Circuit;
};

export type Circuit = {
	key: number;
	shortName: string;
};

export type Country = {
	key: number;
	code: string;
	name: string;
};

export type SessionData = {
	series: Series[];
	statusSeries: StatusSeries[];
};

export type StatusSeries = {
	utc: string;
	trackStatus: string;
};

export type Series = {
	utc: string;
	lap: number;
};

export type LapCount = {
	currentLap: number;
	totalLaps: number;
};

/**
 * Timing data for all drivers in the session
 */
export type TimingData = {
	/** Racing numbers of drivers not entered in the session */
	noEntries?: number[];
	/** Current part of the session (e.g., 1 for Q1, 2 for Q2, 3 for Q3) */
	sessionPart?: number;
	/** Cut-off time for qualification */
	cutOffTime?: string;
	/** Cut-off percentage for 107% rule */
	cutOffPercentage?: string;
	/** Timing data for each driver indexed by racing number */
	lines: {
		[key: string]: TimingDataDriver;
	};
	/** Whether timing data is being withheld */
	withheld: boolean;
};

/**
 * Timing data for a specific driver
 */
export type TimingDataDriver = {
	/** Statistics about time differences */
	stats?: { 
		/** Time difference to the fastest lap */
		timeDiffToFastest: string; 
		/** Time difference to the position ahead */
		timeDifftoPositionAhead: string 
	}[];
	/** Time difference to the fastest lap */
	timeDiffToFastest?: string;
	/** Time difference to the position ahead */
	timeDiffToPositionAhead?: string;
	/** Gap to the leader in time or laps */
	gapToLeader: string;
	/** Interval to the position ahead */
	intervalToPositionAhead?: {
		/** Value of the interval */
		value: string;
		/** Whether the driver is catching up to the position ahead */
		catching: boolean;
	};
	/** Line number for display order */
	line: number;
	/** Current position in the race or session */
	position: string;
	/** Whether to show the position */
	showPosition: boolean;
	/** Racing number of the driver */
	racingNumber: string;
	/** Whether the driver has retired from the race */
	retired: boolean;
	/** Whether the driver is in the pit */
	inPit: boolean;
	/** Whether the driver has just exited the pit */
	pitOut: boolean;
	/** Whether the driver has stopped on track */
	stopped: boolean;
	/** Status code for the driver */
	status: number;
	/** Sector times for the driver */
	sectors: Sector[];
	/** Speed trap measurements */
	speeds: Speeds;
	/** Best lap time for the driver */
	bestLapTime: PersonalBestLapTime;
	/** Last lap time for the driver */
	lastLapTime: TimingValue;
	/** Number of laps completed */
	numberOfLaps: number;
	/** Whether the driver has been knocked out in qualifying */
	knockedOut?: boolean;
	/** Whether the driver is below the cut-off time */
	cutoff?: boolean;
};

/**
 * Information about a sector time
 */
export type Sector = {
	/** Whether the driver has stopped in this sector */
	stopped: boolean;
	/** Time value for the sector */
	value: string;
	/** Previous time value for comparison */
	previousValue?: string;
	/** Status code for the sector */
	status: number;
	/** Whether this is the fastest time overall for this sector */
	overallFastest: boolean;
	/** Whether this is the driver's personal fastest time for this sector */
	personalFastest: boolean;
	/** Mini-sectors within this sector */
	segments: {
		/** Status code for the segment */
		status: number;
	}[];
};

/**
 * Speed measurements at different points on the track
 */
export type Speeds = {
	/** Intermediate 1 speed trap */
	i1: TimingValue;
	/** Intermediate 2 speed trap */
	i2: TimingValue;
	/** Finish line speed trap */
	fl: TimingValue;
	/** Straight speed trap */
	st: TimingValue;
};

/**
 * A timing value with status information
 */
export type TimingValue = {
	/** The timing value (time or speed) */
	value: string;
	/** Status code for the timing value */
	status: number;
	/** Whether this is the fastest value overall */
	overallFastest: boolean;
	/** Whether this is the driver's personal fastest value */
	personalFastest: boolean;
};

export type TimingStatsDriver = {
	line: number;
	racingNumber: string;
	personalBestLapTime: PersonalBestLapTime;
	bestSectors: PersonalBestLapTime[];
	bestSpeeds: {
		i1: PersonalBestLapTime;
		i2: PersonalBestLapTime;
		fl: PersonalBestLapTime;
		st: PersonalBestLapTime;
	};
};

export type PersonalBestLapTime = {
	value: string;
	position: number;
};

export type TopThreeDriver = {
	position: string;
	showPosition: boolean;
	racingNumber: string;
	tla: string;
	broadcastName: string;
	fullName: string;
	team: string;
	teamColour: string;
	lapTime: string;
	lapState: number;
	diffToAhead: string;
	diffToLeader: string;
	overallFastest: boolean;
	personalFastest: boolean;
};

export type TeamRadio = {
	captures: RadioCapture[];
};

export type RadioCapture = {
	utc: string;
	racingNumber: string;
	path: string;
};

export type Position = {
	Position: PositionItem[];
};

export type PositionItem = {
	Timestamp: string;
	Entries: Positions;
};

export type Positions = {
	// this is what we have at state
	[key: string]: PositionCar;
};

export type PositionCar = {
	Status: string;
	X: number;
	Y: number;
	Z: number;
};

export type CarData = {
	Entries: Entry[];
};

export type Entry = {
	Utc: string;
	Cars: CarsData;
};

export type CarsData = {
	// this is what we have at state
	[key: string]: {
		Channels: CarDataChannels;
	};
};

/**
 * Historical data for drivers, including lap times, gaps, and sector times
 */
export type DriverHistory = {
	/** Gap to the driver in front, indexed by racing number */
	gapFront?: {
		[racingNumber: string]: number[];
	};
	/** Lap times, indexed by racing number */
	lapTime?: {
		[racingNumber: string]: number[];
	};
	/** Sector times, indexed by racing number and sector number */
	sectors?: {
		[racingNumber: string]: {
			[sectorIndex: number]: number[];
		};
	};
};

/**
 * Telemetry data channels from the car
 * Each property represents a different data channel
 */
export type CarDataChannels = {
	/** 0 - RPM (Engine revolutions per minute) */
	"0": number;
	/** 1 - Speed (km/h) */
	"1"?: number;
	/** 2 - Speed (km/h) */
	"2": number;
	/** 3 - Gear number (0=neutral, 1-8=gears) */
	"3": number;
	/** 4 - Throttle position (0-100%) */
	"4": number;
	/** 5 - Brake application (0=off, 1=on) */
	"5": number;
	/** 6 - Clutch */
	"6"?: number;
	/** 7 - Rev lights */
	"7"?: number;
	/** 8 - Rev lights panel */
	"8"?: number;
	/** 9 - Engine temperature */
	"9"?: number;
	/** 10 - Oil pressure */
	"10"?: number;
	/** 11 - Water temperature */
	"11"?: number;
	/** 12 - Fuel pressure */
	"12"?: number;
	/** 13 - Fuel level */
	"13"?: number;
	/** 14 - Fuel capacity */
	"14"?: number;
	/** 15 - Fuel remaining laps */
	"15"?: number;
	/** 16 - Boost pressure */
	"16"?: number;
	/** 17 - Car position */
	"17"?: number;
	/** 18 - Power */
	"18"?: number;
	/** 19 - Torque */
	"19"?: number;
	/** 20 - ERS deployment mode */
	"20"?: number;
	/** 21 - ERS-K harvesting status */
	"21"?: number;
	/** 22 - ERS-K output */
	"22"?: number;
	/** 23 - ERS-H output */
	"23"?: number;
	/** 24 - ERS battery charge */
	"24"?: number;
	/** 25 - ERS battery capacity */
	"25"?: number;
	/** 26 - ERS stored energy */
	"26"?: number;
	/** 27 - ERS deployment */
	"27"?: number;
	/** 28 - ERS deployment strategy */
	"28"?: number;
	/** 29 - Tire pressure front left */
	"29"?: number;
	/** 30 - Tire pressure front right */
	"30"?: number;
	/** 31 - Tire pressure rear left */
	"31"?: number;
	/** 32 - Tire pressure rear right */
	"32"?: number;
	/** 33 - Tire temperature front left */
	"33"?: number;
	/** 34 - Tire temperature front right */
	"34"?: number;
	/** 35 - Tire temperature rear left */
	"35"?: number;
	/** 36 - Tire temperature rear right */
	"36"?: number;
	/** 37 - Tire wear front left */
	"37"?: number;
	/** 38 - Tire wear front right */
	"38"?: number;
	/** 39 - Tire wear rear left */
	"39"?: number;
	/** 40 - Tire wear rear right */
	"40"?: number;
	/** 41 - Tire compound */
	"41"?: number;
	/** 42 - Brake temperature front left */
	"42"?: number;
	/** 43 - Brake temperature front right */
	"43"?: number;
	/** 44 - Brake temperature rear left */
	"44"?: number;
	/** 45 - DRS status (8=possible, >9=active) */
	"45": number;
	/** 46 - Brake temperature rear right */
	"46"?: number;
	/** Additional channels may be present */
	[key: string]: number | undefined;
};
