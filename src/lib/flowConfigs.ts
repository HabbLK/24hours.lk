import { KAPRUKA_CATEGORIES } from "@/lib/kaprukaCategories";

export interface SlotDef {
  key: string;
  question: string;
  widget: "text" | "date" | "select" | "number";
  options?: { label: string; value: string }[]; // for widget: "select"
  min?: number; // for widget: "number"
  max?: number;
  // For widget: "date" — the key of another date slot this one must come
  // strictly after (e.g. returnDate must be after date, checkout after checkin).
  minDateSlot?: string;
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

// ---------------------------------------------------------------------
// Fuzzy word matching — so typos like "fud", "parsel", "motor traffik",
// "licence" vs "license" etc. still resolve without needing every typo
// hand-entered into INTENT_KEYWORDS.
// ---------------------------------------------------------------------

function levenshteinDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Words of 3 letters or fewer must match exactly (typo tolerance on "bus"
// or "nic" would cause false positives like "but"/"nice"). Longer words
// get 1-2 letters of slack depending on length.
function maxAllowedDistance(word: string): number {
  if (word.length <= 3) return 0;
  if (word.length <= 6) return 1;
  return 2;
}

function wordsFuzzyMatch(w1: string, w2: string): boolean {
  if (w1 === w2) return true;
  const threshold = Math.min(maxAllowedDistance(w1), maxAllowedDistance(w2));
  return threshold > 0 && levenshteinDistance(w1, w2) <= threshold;
}

function tokenize(message: string): string[] {
  return message.toLowerCase().match(/[a-z]+/g) || [];
}

// A keyword can be multi-word ("motor traffic") — every word in it needs
// a fuzzy match somewhere in the message, in any order.
function phraseFuzzyMatch(messageWords: string[], keywordPhrase: string): boolean {
  return keywordPhrase
    .split(" ")
    .every((kw) => messageWords.some((w) => wordsFuzzyMatch(w, kw)));
}

// ---------------------------------------------------------------------
// Intent detection
// ---------------------------------------------------------------------

// Keyword -> flowKey. Checked against the user's free-text message
// (via fuzzy phrase matching, see above — so spelling variants/typos
// don't need to be listed individually).
// NOTE: "appointment"/"appointments" deliberately excluded — it's
// ambiguous between DMT and doctor, so it's handled separately below via
// AMBIGUOUS_KEYWORDS instead of being bound to a single flow.
const INTENT_KEYWORDS: Record<string, string[]> = {
  flight: ["flight", "fly", "plane", "air ticket", "airline"],
  bus: ["bus"],
  train: ["train", "rail"],
  hotel: ["hotel", "room", "stay", "accommodation"],
  taxi: ["taxi", "cab", "ride"],
  doctor: ["doctor", "channel", "hospital"],
  shop: ["shopping", "shop", "purchase", "get items"],
  job: ["job", "career", "vacancy", "hiring", "work"],
  nic: ["nic", "identity card", "national id"],
  food: ["food", "eat", "hungry", "restaurant"],
  parcel: ["delivery", "parcel", "send item", "deliver"],
  drivingLicence: [
    "driving license", "driving licence",
    "dl renewal", "renew dl", "renew driving",
    "renew license", "renew licence",
    "license renewal", "licence renewal",
    "motor traffic", "motor",
    "dmt",
  ],
  revenueLicence: ["revenue license", "revenue licence", "vehicle license", "vehicle licence"],
};

// Keywords that could reasonably mean more than one flow. Checked BEFORE
// INTENT_KEYWORDS. When one hits, detectIntent asks the caller to show a
// disambiguation choice instead of picking a flow itself.
const AMBIGUOUS_KEYWORDS: Record<string, string[]> = {
  appointment: ["dmtAppointment", "doctor"],
  appointments: ["dmtAppointment", "doctor"],
  license: ["drivingLicence", "revenueLicence"],
  licence: ["drivingLicence", "revenueLicence"],
  licens: ["drivingLicence", "revenueLicence"],
};

export type IntentResult =
  | { type: "flow"; flowKey: string }
  | { type: "ambiguous"; options: string[] }
  | null;

export function detectIntent(message: string): IntentResult {
  const words = tokenize(message);

  for (const [kw, flowKeys] of Object.entries(AMBIGUOUS_KEYWORDS)) {
    if (phraseFuzzyMatch(words, kw)) {
      return { type: "ambiguous", options: flowKeys };
    }
  }

  for (const [flowKey, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some((kw) => phraseFuzzyMatch(words, kw))) return { type: "flow", flowKey };
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

// Validates a raw answer for a given slot. Returns { valid: true } or
// { valid: false, error } — the caller (chat UI) should show `error` as a
// bot message and NOT advance to the next slot when invalid.
export function validateSlotInput(
  slot: SlotDef,
  rawValue: string,
  collectedSlots: Record<string, string>
): { valid: boolean; error?: string } {
  const value = rawValue.trim();

  if (slot.widget === "number") {
    if (!/^\d+$/.test(value)) {
      return { valid: false, error: "Please type in a number — no letters or special characters." };
    }
    const num = Number(value);
    if (slot.min !== undefined && num < slot.min) {
      return { valid: false, error: `Please enter a number of at least ${slot.min}.` };
    }
    if (slot.max !== undefined && num > slot.max) {
      return { valid: false, error: `Please enter a number no higher than ${slot.max}.` };
    }
    return { valid: true };
  }

  if (slot.widget === "date") {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { valid: false, error: "Please enter a valid date." };
    }
    if (slot.minDateSlot && collectedSlots[slot.minDateSlot]) {
      const minDate = new Date(collectedSlots[slot.minDateSlot]);
      if (!isNaN(minDate.getTime()) && date.getTime() <= minDate.getTime()) {
        return {
          valid: false,
          error: `Please choose a date after ${collectedSlots[slot.minDateSlot]}.`,
        };
      }
    }
    return { valid: true };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------
// Flows
// ---------------------------------------------------------------------

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
        minDateSlot: "date",
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
      { key: "checkout", question: "Check-out date?", widget: "date", minDateSlot: "checkin" },
      {
        key: "rooms",
        question: "How many rooms do you need?",
        widget: "number",
        min: 1,
        max: 10,
      },
      {
        key: "adults",
        question: "How many adults in total?",
        widget: "number",
        min: 1,
        max: 30,
      },
      {
        key: "children",
        question: "Any children? If so, how many? (enter 0 if none)",
        widget: "number",
        min: 0,
        max: 10,
      },
      {
        key: "childrenAges",
        question: "What are their ages? (e.g. 8, 12)",
        widget: "text",
        showIf: (slots) => !!slots.children && Number(slots.children) > 0,
      },
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
    label: "Doctor Appointment",
    matchTags: ["doctor", "channeling"],
    slots: [
      { key: "specialty", question: "What kind of doctor or specialty do you need?", widget: "text" },
      {
        key: "hospital",
        question: "Any preferred hospital? (or type 'any')",
        widget: "text",
      },
      {
        key: "doctorName",
        question: "Looking for a specific doctor? (or type 'any')",
        widget: "text",
      },
      { key: "date", question: "Preferred appointment date?", widget: "date" },
    ],
  },
  // "appointment" tag is unique to "DMT Appointment Booking" in seed.ts,
  // so this isolates just that one provider — no questions needed, it
  // jumps straight to fetchProviders.
  dmtAppointment: {
    flowKey: "dmtAppointment",
    label: "Motor Traffic Appointment",
    matchTags: ["appointment"],
    slots: [],
  },
  shop: {
    flowKey: "shop",
    label: "Shop",
    matchTags: ["gift", "shopping"],
    slots: [
      {
        key: "category",
        question: "What would you like to order?",
        widget: "select",
        options: [
          ...Object.keys(KAPRUKA_CATEGORIES).map((name) => ({ label: name, value: name })),
          { label: "Something else (search by keyword)", value: "other" },
        ],
      },
      {
        key: "item",
        question: "What are you looking for?",
        widget: "text",
        showIf: (slots) => slots.category === "other",
      },
    ],
  },
  job: {
    flowKey: "job",
    label: "Jobs",
    matchTags: ["job", "career", "freelance", "gig"],
    slots: [
      { key: "jobTitle", question: "What kind of job are you looking for?", widget: "text" },
      { key: "jobLocation", question: "Which city? (or type 'any')", widget: "text" },
    ],
  },
  nic: {
    flowKey: "nic",
    label: "NIC",
    matchTags: ["nic", "id"],
    slots: [
      {
        key: "language",
        question: "Which language would you like the NIC portal in?",
        widget: "select",
        options: [
          { label: "English", value: "en" },
          { label: "Sinhala", value: "si" },
          { label: "Tamil", value: "ta" },
        ],
      },
    ],
  },
  food: {
    flowKey: "food",
    label: "Food",
    matchTags: ["food"],
    slots: [],
  },
  parcel: {
    flowKey: "parcel",
    label: "Parcel",
    matchTags: ["p2p"],
    slots: [],
  },
  drivingLicence: {
    flowKey: "drivingLicence",
    label: "Driving Licence",
    matchTags: ["driving"],
    slots: [],
  },
  revenueLicence: {
    flowKey: "revenueLicence",
    label: "Revenue Licence",
    matchTags: ["revenue"],
    slots: [],
  },
};