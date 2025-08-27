export type Timeframe = "hour" | "day" | "week";
export type DoseFamily = "Hopium" | "Copium" | "Mixed";
export type Dose = {
  lossPct: number;
  display: number;
  unit: string;
  timeframe: Timeframe;
  family: DoseFamily;
};

export const MEME_MULTIPLIER = 0.1337;

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function calculateLossPercent(initial: number, current: number): number {
  if (initial <= 0) throw new Error("Initial must be > 0");
  const safeCurrent = Math.max(0, current);
  const loss = ((initial - safeCurrent) / initial) * 100;
  return Math.max(0, loss);
}

export function capLossForCompute(lossPct: number): number {
  // Cap to 999 for computation per spec
  return clamp(lossPct, 0, 999);
}

export function baseDosePerDay(lossPct: number): number {
  const capped = capLossForCompute(lossPct);
  return Math.max(0, capped * MEME_MULTIPLIER);
} 