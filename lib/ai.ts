import type { Timeframe } from "./calc";

export const cannedLines: string[] = [
	"Anon, the halving is basically tomorrow; keep those {DOSE} flowing. 💨",
	"{TOKEN} will awaken any minute now. Inhale, believe, repeat.",
	"Just a temporary retrace. Double the dose: {DOSE} to the moon.",
	"Your bags are heavy, but your lungs are stronger. {DOSE} prescribed.",
	"Doctors hate this one trick: copium microdosing at {DOSE}.",
	"If you never sell, you never lose. Maintain {DOSE} and manifest.",
	"Wen lambo? Soon as you finish this {DOSE} cycle, anon.",
	"Paper hands sell, diamond hands inhale {DOSE} daily.",
	"Your portfolio is down but your spirit is up. {DOSE} therapy works.",
	"Remember: it's not a loss until you sell. {DOSE} until moon.",
	"Technical analysis shows {TOKEN} is forming a perfect copium pattern.",
	"Trust the process, anon. {DOSE} is the way to financial freedom.",
	"Your losses are just temporary. {DOSE} is forever.",
	"WAGMI - We're All Gonna Make It. Just need more {DOSE}.",
	"FUD is temporary, {DOSE} is eternal. Keep breathing, king.",
	"Your bags are heavy because they're full of potential. {DOSE} unlocks it.",
	"Anon, you're not losing money, you're gaining experience. And {DOSE}.",
	"The market is wrong, you're right. {DOSE} proves it.",
	"Every dip is a buying opportunity. Every {DOSE} is a moon ticket.",
	"Your portfolio is like a fine wine - it gets better with age and {DOSE}.",
	"Remember: Rome wasn't built in a day, but {TOKEN} will moon overnight.",
	"Your losses are just the market's way of saying 'buy more {DOSE}'.",
	"Anon, you're not a bagholder, you're a {DOSE} collector.",
	"The best time to buy was yesterday. The best time to {DOSE} is now.",
	"Your portfolio is down 90% but your {DOSE} game is up 1000%.",
	"Wen recovery? Soon as you finish this {DOSE} pack, ser.",
	"Your bags are heavy because they're full of future gains. {DOSE} fuels the journey.",
	"Anon, you're not losing money, you're investing in {DOSE} education.",
	"The market is testing your resolve. {DOSE} is your answer."
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
	console.log("Original token:", token);
	const formattedToken = token ? (token.startsWith('$') ? `$${token.slice(1).toUpperCase()}` : `$${token.toUpperCase()}`) : "$BAG";
	console.log("Formatted token:", formattedToken);
	return line
		.replace("{TOKEN}", formattedToken)
		.replace("{DOSE}", doseDisplay);
} 