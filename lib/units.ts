import type { Timeframe, DoseFamily } from "./calc";

export const TIMEFRAMES: readonly Timeframe[] = ["hour", "day", "week"] as const;

export const UNITS: Record<DoseFamily, readonly string[]> = {
	Hopium: ["packs", "vapes", "tanks", "puffs"],
	Copium: ["pills", "IV drips", "injections"],
	Mixed: ["whiffs", "sniffs", "balloons", "barrels"],
} as const;

export function randomPick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandomUnit(): { family: DoseFamily; unit: string } {
	const families = Object.keys(UNITS) as DoseFamily[];
	const family = randomPick(families);
	const unit = randomPick(UNITS[family]);
	return { family, unit };
}

export function scalePerTimeframe(basePerDay: number, timeframe: Timeframe): number {
	switch (timeframe) {
		case "hour":
			return basePerDay / 24;
		case "week":
			return basePerDay * 7;
		case "day":
		default:
			return basePerDay;
	}
} 