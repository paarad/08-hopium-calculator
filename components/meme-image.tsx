"use client";

import Image from "next/image";
import { useMemo } from "react";

const UNIT_TO_IMAGE: Record<string, string> = {
	// Hopium units
	packs: "/memes/pepe_mask_1.png",    // gas mask
	vapes: "/memes/pepe_mask_5.png",    // vape/clouds  
	tanks: "/memes/pepe_mask_8.png",    // barrel/tank
	puffs: "/memes/pepe_mask_1.png",    // gas mask (alternative)
	
	// Copium units
	pills: "/memes/pepe_mask_6.png",    // pill bottles
	"IV drips": "/memes/pepe_mask_4.png", // IV drip
	injections: "/memes/pepe_mask_4.png", // IV drip (alternative)
	
	// Mixed units
	whiffs: "/memes/pepe_mask_3.png",   // inhaling/sniffing
	sniffs: "/memes/pepe_mask_3.png",   // inhaling/sniffing
	balloons: "/memes/pepe_mask_7.png", // balloons
	barrels: "/memes/pepe_mask_8.png",  // barrel/tank
};

export default function MemeImage({ unit }: { unit: string }) {
	const src = useMemo(() => {
		return UNIT_TO_IMAGE[unit] || "/memes/pepe_mask_1.png"; // fallback to gas mask
	}, [unit]);

	return (
		<div className="relative w-full max-w-sm aspect-square overflow-hidden rounded-lg border bg-card">
			<Image src={src} alt="meme" fill className="object-cover" />
		</div>
	);
} 