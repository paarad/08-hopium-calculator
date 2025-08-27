export type Timeframe = "hour" | "day" | "week";
export type DoseFamily = "Hopium" | "Copium" | "Mixed";
export type Dose = {
  lossPct: number;
  display: number;
  unit: string;
  timeframe: Timeframe;
  family: DoseFamily;
};

export const MEME_MULTIPLIER = 0.5; // Balanced multiplier for satisfying but realistic doses

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
  const rawDose = Math.max(0, capped * MEME_MULTIPLIER);
  
  // Round to cleaner, more satisfying numbers
  if (rawDose < 10) {
    // For small doses, round to 0.5
    return Math.round(rawDose * 2) / 2;
  } else if (rawDose < 50) {
    // For medium doses, round to whole numbers
    return Math.round(rawDose);
  } else if (rawDose < 200) {
    // For larger doses, round to nearest 5
    return Math.round(rawDose / 5) * 5;
  } else {
    // For very large doses, round to nearest 10
    return Math.round(rawDose / 10) * 10;
  }
} 