export interface SlotDef {
  key: string;
  question: string;
  widget: "text" | "date" | "select" | "number";
  options?: { label: string; value: string }[]; // for widget: "select"
  min?: number; // for widget: "number"
  max?: number;
  // Only ask this slot if the condition passes, given slots collected so far.
  // Omit for "always ask".
  showIf?: (slots: Record<string, string>) => boolean;
}

export interface FlowConfig {
  flowKey: string;
  label: string;
  matchTags: string[]; // used to find providers in Service.tags
  slots: SlotDef[];
}

// Keyword -> flowKey. Checked against the user's free-text message.
const INTENT_KEYWORDS: Record<string, string[]> = {
  flight: ["flight", "fly", "plane", "air ticket", "airline"],
  bus: ["bus"],
  train: ["train", "rail"],
  hotel: ["hotel", "room", "stay", "accommodation"],
  taxi: ["taxi", "cab", "ride"],
  doctor: ["doctor", "channel", "appointment", "hospital"],
};

export function detectIntent(message: string): string | null {
  const lower = message.toLowerCase();
  for (const [flowKey, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return flowKey;
  }
  return null;
}

// Very light entity extraction so "book a flight to Chennai" pre-fills
// destination without a full NLP stack. Extend patterns as needed.
export function extractEntities(message: string): Partial<Record<string, string>> {
  const entities: Record<string, string> = {};
  const toMatch = message.match(/\bto\s+([A-Za-z\s]+?)(?:\.|,|$| on | for )/i);
  if (toMatch) entities.destination = toMatch[1].trim();
  const fromMatch = message.match(/\bfrom\s+([A-Za-z\s]+?)(?:\.|,|$| to | on )/i);
  if (fromMatch) entities.origin = fromMatch[1].trim();
  return entities;
}

export const FLOWS: Record<string, FlowConfig> = {
  flight: {
    flowKey: "flight",
    label: "Flight",
    matchTags: ["flight", "airline"],
    slots: [
      { key: "origin", question: "Which city are you flying from?", widget: "text" },
      { key: "destination", question: "Where are you headed?", widget: "text" },
      { key: "date", question: "What date do you want to travel?", widget: "date" },
      {
        key: "tripType",
        question: "One way, or round trip?",
        widget: "select",
        options: [
          { label: "One way", value: "one_way" },
          { label: "Round trip", value: "round_trip" },
        ],
      },
      {
        key: "returnDate",
        question: "When would you like to return?",
        widget: "date",
        showIf: (slots) => slots.tripType === "round_trip",
      },
      {
        key: "passengers",
        question: "How many passengers?",
        widget: "number",
        min: 1,
        max: 9,
      },
    ],
  },
  bus: {
    flowKey: "bus",
    label: "Bus",
    matchTags: ["bus"],
    slots: [
      { key: "origin", question: "Which town are you leaving from?", widget: "text" },
      { key: "destination", question: "Where are you headed?", widget: "text" },
      { key: "date", question: "What date do you want to travel?", widget: "date" },
    ],
  },
  train: {
    flowKey: "train",
    label: "Train",
    matchTags: ["train", "railway"],
    slots: [
      { key: "origin", question: "Which station are you leaving from?", widget: "text" },
      { key: "destination", question: "Which station are you headed to?", widget: "text" },
      { key: "date", question: "What date do you want to travel?", widget: "date" },
    ],
  },
  hotel: {
    flowKey: "hotel",
    label: "Hotel",
    matchTags: ["hotel", "accommodation", "stay"],
    slots: [
      { key: "destination", question: "Which city or area do you want to stay in?", widget: "text" },
      { key: "checkin", question: "Check-in date?", widget: "date" },
      { key: "checkout", question: "Check-out date?", widget: "date" },
    ],
  },
  taxi: {
    flowKey: "taxi",
    label: "Taxi",
    matchTags: ["taxi", "ride"],
    slots: [
      { key: "origin", question: "Where should the ride start?", widget: "text" },
      { key: "destination", question: "Where are you headed?", widget: "text" },
    ],
  },
  doctor: {
    flowKey: "doctor",
    label: "Doctor",
    matchTags: ["doctor", "channeling"],
    slots: [
      { key: "specialty", question: "What kind of doctor or specialty do you need?", widget: "text" },
      { key: "date", question: "Preferred appointment date?", widget: "date" },
    ],
  },
};