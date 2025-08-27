"use client";

import { useMemo } from "react";
import type { Dose, Timeframe } from "@/lib/calc";
import { formatDoseDisplay, formatPercent } from "@/lib/format";
import MemeImage from "./meme-image";

export default function ResultCard(props: {
	lossPct: number;
	doseDisplayValue: number;
	unit: string;
	timeframe: Timeframe;
	family: Dose["family"];
	message: string;
	memeSeed: number;
	onRerollUnit: () => void;
	onRerollMessage: () => void;
	onCopy: () => void;
	onShare: () => void;
}) {
	const isProfit = props.lossPct === 0;
	const badgeText = isProfit ? `Loss: 0%` : `Loss: ${formatPercent(props.lossPct)}`;
	const doseText = useMemo(
		() => formatDoseDisplay(props.doseDisplayValue, props.unit, props.timeframe),
		[props.doseDisplayValue, props.unit, props.timeframe]
	);
	return (
		<div className="w-full max-w-2xl rounded-xl border bg-card text-card-foreground p-4 md:p-6 flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${isProfit ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
					{badgeText}
				</span>
				<div className="text-sm text-muted-foreground">{props.family}</div>
			</div>

			<div>
				<div className="text-lg text-muted-foreground">Recommended dose</div>
				<div className="text-3xl md:text-5xl font-extrabold tracking-tight">{doseText}</div>
			</div>

			<p className="text-base md:text-lg leading-relaxed">{props.message}</p>

			<MemeImage seed={props.memeSeed} />

			<div className="flex flex-wrap gap-2">
				<button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={props.onRerollUnit}>Reroll unit</button>
				<button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={props.onRerollMessage}>Reroll message</button>
				<button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={props.onCopy}>Copy Result</button>
				<button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={props.onShare}>Share</button>
			</div>
		</div>
	);
} 