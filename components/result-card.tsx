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

	const handleTwitterShare = () => {
		const doseDisplay = formatDoseDisplay(props.doseDisplayValue, props.unit, props.timeframe);
		const text = `I lost ${Math.round(props.lossPct)}% and need ${doseDisplay} daily. ${props.message}`;
		const url = encodeURIComponent(window.location.href);
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
		window.open(twitterUrl, '_blank');
	};

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

			<MemeImage unit={props.unit} />

			<div className="flex flex-wrap gap-3">
				<button 
					className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200  active:scale-95 cursor-pointer hover:shadow-sm"
					onClick={props.onRerollUnit}
				>
					🔄 Reroll unit
				</button>
				<button 
					className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200  active:scale-95 cursor-pointer hover:shadow-sm"
					onClick={props.onRerollMessage}
				>
					💬 Reroll message
				</button>
				<button 
					className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200  active:scale-95 cursor-pointer hover:shadow-sm"
					onClick={handleTwitterShare}
				>
					
					Share on 
					<svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
					</svg>
				</button>
				
			</div>
		</div>
	);
} 