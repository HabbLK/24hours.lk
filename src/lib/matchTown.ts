// lib/matchTown.ts
import { distance } from "fastest-levenshtein";
import { SRI_LANKA_TOWNS } from "./towns";

export function matchTown(input: string): { matched: string; confidence: number } | null {
  const normalized = input.trim().toLowerCase();

  // 1. Exact match first
  const exact = SRI_LANKA_TOWNS.find((t) => t.toLowerCase() === normalized);
  if (exact) return { matched: exact, confidence: 1 };

  // 2. Fuzzy match — find closest town by edit distance
  let best: { town: string; dist: number } | null = null;
  for (const town of SRI_LANKA_TOWNS) {
    const d = distance(normalized, town.toLowerCase());
    if (!best || d < best.dist) best = { town, dist: d };
  }

  if (!best) return null;

  // Allow more typos for longer names (e.g. "Kilinochchi" can tolerate 2-3 edits)
  const maxAllowedDistance = Math.max(2, Math.floor(best.town.length * 0.3));
  if (best.dist <= maxAllowedDistance) {
    return { matched: best.town, confidence: 1 - best.dist / best.town.length };
  }
  return null;
}