// Only providers with documented/known query params get a pre-filled deep
// link. Everyone else falls back to their plain homepage — being honest
// about this here avoids silently sending users to a broken URL.
const DEEP_LINK_TEMPLATES: Record<string, (slots: Record<string, string>) => string> = {
  "booking-com": (slots) =>
    `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(slots.destination || "")}` +
    (slots.checkin ? `&checkin=${slots.checkin}` : "") +
    (slots.checkout ? `&checkout=${slots.checkout}` : ""),

  agoda: (slots) =>
    `https://www.agoda.com/search?city=${encodeURIComponent(slots.destination || "")}`,

  // Confirmed against sltb.eseat.lk's own generated search URL:
  // type=1 (intercity), from/to as plain place names, from_date required,
  // to_date left blank for one-way searches.
  "bus-tickets-sltb": (slots) =>
    `https://sltb.eseat.lk/search?type=1` +
    `&from=${encodeURIComponent(capitalize(slots.origin || ""))}` +
    `&to=${encodeURIComponent(capitalize(slots.destination || ""))}` +
    `&from_date=${slots.date || ""}` +
    `&to_date=${slots.returnDate || ""}`,

  // Confirmed: busseat.lk encodes the route directly in the path as
  // /buses/{From}/{To}/{DD-MM-YYYY} — no query string at all.
  "busseat-lk": (slots) =>
    `https://busseat.lk/buses/` +
    `${encodeURIComponent(capitalize(slots.origin || ""))}/` +
    `${encodeURIComponent(capitalize(slots.destination || ""))}/` +
    `${toDDMMYYYY(slots.date || "")}`,

  // Confirmed against bus.lk's own generated search URL. type=any and
  // departure=asc are fixed defaults; to_date stays "++" for one-way trips,
  // matching what their own site produces when no return date is set.
  "bus-lk": (slots) =>
    `https://bus.lk/search?from=${encodeURIComponent(capitalize(slots.origin || ""))}` +
    `&to=${encodeURIComponent(capitalize(slots.destination || ""))}` +
    `&from_date=${slots.date || ""}` +
    `&to_date=${slots.returnDate ? slots.returnDate : "++"}` +
    `&type=any&departure=asc`,

  // Magiya uses internal numeric city IDs (pickup_id/destination_id), not
  // plain names — there's no way to derive these generically. This only
  // works for cities in MAGIYA_CITY_IDS below; anything else throws and
  // falls back to the generic tracking-param link instead of a broken URL.
  "magiya-lk": (slots) => {
    const originId = MAGIYA_CITY_IDS[(slots.origin || "").toLowerCase()];
    const destId = MAGIYA_CITY_IDS[(slots.destination || "").toLowerCase()];
    if (!originId || !destId) throw new Error("Unknown Magiya city — no ID mapping");
    return (
      `https://magiya.lk/journeys/search?pickup_id=${originId}` +
      `&destination_id=${destId}` +
      `&date_of_journey=${slots.date || ""}` +
      `&from_city_name=${encodeURIComponent(capitalize(slots.origin || ""))}` +
      `&to_city_name=${encodeURIComponent(capitalize(slots.destination || ""))}` +
      `&pickup_id_proximity=5&destination_id_proximity=5&dep_time_order=0&operator_filter=0`
    );
  },
};

// Known Magiya city IDs — extend this as you discover more by doing a
// manual search on magiya.lk and reading the resulting URL, same as before.
const MAGIYA_CITY_IDS: Record<string, string> = {
  batticaloa: "290",
  colombo: "1863", // Pettah Bus Stand — Magiya's ID for "Colombo" specifically
};

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function toDDMMYYYY(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso; // not a valid YYYY-MM-DD, return as-is
  return `${day}-${month}-${year}`;
}

export function buildDeepLink(serviceSlug: string, externalUrl: string, slots: Record<string, string>): string {
  const template = DEEP_LINK_TEMPLATES[serviceSlug];
  if (template) {
    try {
      return template(slots);
    } catch {
      // fall through to generic fallback below
    }
  }

  // No known pre-fill format for this provider. We still attach the
  // collected details as query params — most sites will just ignore
  // unrecognized params, but this keeps the data attached to the link
  // for our own tracking rather than silently dropping it, and it's
  // visible to the user in the address bar if they check.
  try {
    const url = new URL(externalUrl);
    url.searchParams.set("ref", "24hourslk");
    for (const [key, value] of Object.entries(slots)) {
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return externalUrl; // externalUrl wasn't a valid absolute URL — just use it as-is
  }
}