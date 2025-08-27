"use client";

import { useCallback, useMemo, useState } from "react";
import { baseDosePerDay, calculateLossPercent, type Timeframe } from "@/lib/calc";
import { TIMEFRAMES, pickRandomUnit, randomPick, scalePerTimeframe } from "@/lib/units";
import { fetchCopingMessage } from "@/lib/ai";
import { formatDoseDisplay } from "@/lib/format";
import ResultCard from "./result-card";

export type FormResult = {
	lossPct: number;
	value: number;
	unit: string;
	timeframe: Timeframe;
	family: "Hopium" | "Copium" | "Mixed";
	message: string;
	memeSeed: number;
};

type NavigatorWithShare = Navigator & {
	share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
};

function track(event: "calculate" | "reroll_unit" | "reroll_message" | "share", props?: Record<string, string | number>) {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any)?.va?.track?.(event, props);
	} catch {}
}

export default function HopiumForm() {
	const [initial, setInitial] = useState<string>("");
	const [current, setCurrent] = useState<string>("");
	const [token, setToken] = useState<string>("");
	const [result, setResult] = useState<FormResult | null>(null);
	const [working, setWorking] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const validNumbers = useMemo(() => {
		const i = Number(initial);
		const c = Number(current);
		if (!Number.isFinite(i) || !Number.isFinite(c)) return null;
		if (i <= 0) return null;
		return { i, c: Math.max(0, c) };
	}, [initial, current]);

	const lossPreview = useMemo(() => {
		if (!validNumbers) return null;
		try {
			return calculateLossPercent(validNumbers.i, validNumbers.c);
		} catch {
			return null;
		}
	}, [validNumbers]);

	const computeAndSet = useCallback(async () => {
		if (!validNumbers) return;
		setError(null);
		setWorking(true);
		try {
			const lossPct = calculateLossPercent(validNumbers.i, validNumbers.c);
			const base = baseDosePerDay(lossPct);
			const timeframe = randomPick(TIMEFRAMES);
			const { family, unit } = pickRandomUnit();
			const per = scalePerTimeframe(base, timeframe);
			let message: string;
			if (lossPct === 0) {
				message = "No Hopium needed. You’re euphoric. 🎉";
			} else {
				const doseDisplay = formatDoseDisplay(per, unit, timeframe);
				message = await fetchCopingMessage({
					lossPct,
					token: token.trim() || undefined,
					doseDisplay,
					unit,
					timeframe,
				});
			}
			setResult({
				lossPct,
				value: per,
				unit,
				timeframe,
				family,
				message,
				memeSeed: Math.floor(Math.random() * 1000000),
			});
			track("calculate", { lossPct: Math.round(lossPct) });
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setWorking(false);
		}
	}, [validNumbers, token]);

	const rerollUnit = useCallback(() => {
		if (!result) return;
		const { family, unit } = pickRandomUnit();
		const timeframe = randomPick(TIMEFRAMES);
		setResult({ ...result, unit, timeframe, family });
		track("reroll_unit");
	}, [result]);

	const rerollMessage = useCallback(async () => {
		if (!result) return;
		const doseDisplay = formatDoseDisplay(result.value, result.unit, result.timeframe);
		const message = await fetchCopingMessage({
			lossPct: result.lossPct,
			token: token.trim() || undefined,
			doseDisplay,
			unit: result.unit,
			timeframe: result.timeframe,
		});
		setResult({ ...result, message });
		track("reroll_message");
	}, [result, token]);

	const copyResult = useCallback(async () => {
		if (!result) return;
		const doseDisplay = formatDoseDisplay(result.value, result.unit, result.timeframe);
		const text = `I lost ${Math.round(result.lossPct)}%${token ? ` on ${token.trim()}` : ""}. Recommended dose: ${doseDisplay}.\n"${result.message}"\nTry yours: hopium.app`;
		if (typeof window !== "undefined" && "clipboard" in window.navigator) {
			await window.navigator.clipboard.writeText(text);
		}
	}, [result, token]);

	const shareResult = useCallback(async () => {
		if (!result) return;
		const doseDisplay = formatDoseDisplay(result.value, result.unit, result.timeframe);
		const text = `I lost ${Math.round(result.lossPct)}%${token ? ` on ${token.trim()}` : ""}. Recommended dose: ${doseDisplay}.\n${result.message}`;
		try {
			const nav: NavigatorWithShare | undefined = typeof window !== "undefined" ? (window.navigator as NavigatorWithShare) : undefined;
			if (nav?.share) {
				await nav.share({ text, title: "Hopium Calculator 💨" });
			} else if (nav && "clipboard" in nav) {
				await nav.clipboard.writeText(`${text}\nTry yours: hopium.app`);
			}
			track("share");
		} catch {}
	}, [result, token]);

	return (
		<div className="w-full max-w-2xl flex flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Amount invested ($)</label>
					<input
						type="number"
						min={0}
						step="0.01"
						value={initial}
						onChange={(e) => setInitial(e.target.value)}
						className="border rounded-md px-3 py-2"
						placeholder="1000"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Current value ($)</label>
					<input
						type="number"
						min={0}
						step="0.01"
						value={current}
						onChange={(e) => setCurrent(e.target.value)}
						className="border rounded-md px-3 py-2"
						placeholder="200"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Token (optional)</label>
					<input
						type="text"
						value={token}
						onChange={(e) => setToken(e.target.value)}
						className="border rounded-md px-3 py-2"
						placeholder="$XYZ"
					/>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<button
					onClick={computeAndSet}
					disabled={!validNumbers || working}
					className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
				>
					{working ? "Calculating..." : "Calculate my dose"}
				</button>
				{lossPreview !== null && (
					<span className="text-sm text-muted-foreground" aria-live="polite">
						Preview loss: {Math.round(lossPreview)}%
					</span>
				)}
			</div>
			{error && (
				<div role="alert" className="text-sm text-red-600">
					{error}
				</div>
			)}
			{result && (
				<div className="pt-2">
					<ResultCard
						lossPct={result.lossPct}
						doseDisplayValue={result.value}
						unit={result.unit}
						timeframe={result.timeframe}
						family={result.family}
						message={result.message}
						memeSeed={result.memeSeed}
						onRerollUnit={rerollUnit}
						onRerollMessage={rerollMessage}
						onCopy={copyResult}
						onShare={shareResult}
					/>
				</div>
			)}
		</div>
	);
} 