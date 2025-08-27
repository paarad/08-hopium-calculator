import type { Timeframe } from "./calc";

export const cannedLines: string[] = [
	"Anon, the halving is basically tomorrow; keep those {DOSE} flowing. 💨",
	"{TOKEN} will awaken any minute now. Inhale, believe, repeat.",
	"Just a temporary retrace. Double the dose: {DOSE} to the moon.",
	"Your bags are heavy, but your lungs are stronger. {DOSE} prescribed.",
	"Doctors hate this one trick: copium microdosing at {DOSE}.",
	"If you never sell, you never lose. Maintain {DOSE} and manifest."
];

export async function fetchCopingMessage(input: {
	lossPct: number;
	token?: string;
	doseDisplay: string;
	unit: string;
	timeframe: Timeframe;
}): Promise<string> {
	try {
		const res = await fetch("/api/cope", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				lossPct: input.lossPct,
				token: input.token,
				dose: input.doseDisplay,
				unit: input.unit,
				timeframe: input.timeframe,
			}),
		});
		if (!res.ok) throw new Error("cope api error");
		const data = await res.json();
		if (data?.message && typeof data.message === "string") return data.message as string;
		throw new Error("invalid response");
	} catch {
		return localCopingMessage(input.lossPct, input.token, input.doseDisplay);
	}
}

export function localCopingMessage(lossPct: number, token: string | undefined, doseDisplay: string): string {
	const line = cannedLines[Math.floor(Math.random() * cannedLines.length)];
	return line
		.replace("{TOKEN}", token ? token : "$BAG")
		.replace("{DOSE}", doseDisplay);
} 