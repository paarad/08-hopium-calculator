import { NextRequest, NextResponse } from "next/server";
import { cannedLines } from "@/lib/ai";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { lossPct, token, dose, unit, timeframe } = body as {
			lossPct: number;
			token?: string;
			dose: string;
			unit: string;
			timeframe: "hour" | "day" | "week";
		};

		console.log("API - Original token:", token);
		const formattedToken = token ? (token.startsWith('$') ? `$${token.slice(1).toUpperCase()}` : `$${token.toUpperCase()}`) : "$BAG";
		console.log("API - Formatted token:", formattedToken);

		// 80% chance to use canned lines (more degen energy)
		// 20% chance to try AI (if available)
		const useCanned = Math.random() < 0.8;

		if (!useCanned) {
			const apiKey = process.env.OPENAI_API_KEY;
			if (apiKey) {
				const prompt = `You are a degen coping coach. Given loss %, token name, and timeframe+unit (e.g., 10.7 Hopium packs/day), return a one-sentence funny coping message. Keep it PG-13, no medical claims. Make it sound like a real degen would say it.\nInput: lossPct=${lossPct.toFixed(0)} token=${formattedToken} dose=${dose} (${unit}/${timeframe})\nOutput:`;
				try {
					const res = await fetch("https://api.openai.com/v1/chat/completions", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${apiKey}`,
						},
						body: JSON.stringify({
							model: "gpt-4o-mini",
							messages: [
								{ role: "system", content: "You write very short, witty, PG-13 coping lines that sound like a real crypto degen." },
								{ role: "user", content: prompt },
							],
							max_tokens: 60,
							temperature: 0.9,
						}),
					});
					if (res.ok) {
						const data = await res.json();
						const message = data?.choices?.[0]?.message?.content?.trim();
						if (message) return NextResponse.json({ message });
					}
				} catch {}
			}
		}

		// Use canned lines (either by choice or as fallback)
		const message = cannedLines[Math.floor(Math.random() * cannedLines.length)]
			.replace("{TOKEN}", formattedToken)
			.replace("{DOSE}", dose);
		return NextResponse.json({ message });
	} catch {
		return NextResponse.json({ message: "Keep breathing, anon. Better days ahead." }, { status: 200 });
	}
} 