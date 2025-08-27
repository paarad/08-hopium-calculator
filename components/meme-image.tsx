"use client";

import Image from "next/image";
import { useMemo } from "react";

const MEME_IMAGES = [
	"/memes/pepe_mask_1.svg",
	"/memes/pepe_mask_2.svg",
	"/memes/pepe_mask_3.svg",
];

export default function MemeImage({ seed }: { seed: number }) {
	const src = useMemo(() => {
		const idx = Math.abs(seed) % MEME_IMAGES.length;
		return MEME_IMAGES[idx];
	}, [seed]);

	return (
		<div className="relative w-full max-w-sm aspect-square overflow-hidden rounded-lg border bg-card">
			<Image src={src} alt="meme" fill className="object-cover" />
		</div>
	);
} 