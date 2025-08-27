export function formatPercent(lossPct: number): string {
	const capped = Math.min(999, Math.max(0, Math.round(lossPct)));
	return capped >= 999 ? "999+%" : `${capped}%`;
}

export function formatNumber1d(value: number): string {
	const rounded = Math.round(value * 10) / 10;
	// Remove trailing .0
	return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

export function formatDoseDisplay(value: number, unit: string, timeframe: string): string {
	return `${formatNumber1d(value)} ${unit}/${timeframe}`;
} 