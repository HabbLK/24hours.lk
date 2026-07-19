// lib/matchList.ts
// Generic fuzzy-match helper, same edit-distance approach as matchTown,
// but usable against any known list of strings (hospitals, specializations,
// etc.) instead of being hardcoded to towns.

import { distance } from "fastest-levenshtein";

export function matchFromList(input: string, list: string[]): { matched: string; confidence: number } | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  const exact = list.find((item) => item.toLowerCase() === normalized);
  if (exact) return { matched: exact, confidence: 1 };

  let best: { item: string; dist: number } | null = null;
  for (const item of list) {
    const d = distance(normalized, item.toLowerCase());
    if (!best || d < best.dist) best = { item, dist: d };
  }
  if (!best) return null;

  const maxAllowedDistance = Math.max(2, Math.floor(best.item.length * 0.3));
  if (best.dist <= maxAllowedDistance) {
    return { matched: best.item, confidence: 1 - best.dist / best.item.length };
  }
  return null;
}