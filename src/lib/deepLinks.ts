// Only providers with documented/known query params get a pre-filled deep
// link. Everyone else falls back to their plain homepage — being honest
// about this here avoids silently sending users to a broken URL.
const DEEP_LINK_TEMPLATES: Record<string, (slots: Record<string, string>) => string> = {
  "booking-com": (slots) => {
    const rooms = slots.rooms || "1";
    const adults = slots.adults || "2";
    const children = slots.children || "0";

    const ages = (slots.childrenAges || "")
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a && !isNaN(Number(a)));
    const ageParams = ages.map((a) => `&age=${a}`).join("");

    return (
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(slots.destination || "")}` +
      (slots.checkin ? `&checkin=${slots.checkin}` : "") +
      (slots.checkout ? `&checkout=${slots.checkout}` : "") +
      `&group_adults=${adults}` +
      `&no_rooms=${rooms}` +
      `&group_children=${children}` +
      ageParams
    );
  },

  agoda: (slots) => {
    const rooms = slots.rooms || "1";
    const adults = slots.adults || "2";
    const children = slots.children || "0";
    return (
      `https://www.agoda.com/search?city=${encodeURIComponent(slots.destination || "")}` +
      (slots.checkin ? `&checkIn=${slots.checkin}` : "") +
      (slots.checkout ? `&checkOut=${slots.checkout}` : "") +
      `&rooms=${rooms}` +
      `&adults=${adults}` +
      `&children=${children}`
    );
  },

  trivago: (slots) => {
    const cityId = TRIVAGO_CITY_IDS[(slots.destination || "").toLowerCase()];
    if (!cityId) throw new Error(`Unknown Trivago city — no ID mapping for: ${slots.destination}`);

    const slug = slugify(slots.destination || "");
    const rooms = slots.rooms || "1";
    const adults = slots.adults || "2";
    const children = Number(slots.children || "0");

    const checkin = toYYYYMMDD(slots.checkin || "");
    const checkout = toYYYYMMDD(slots.checkout || "");

    const rc = children > 0 ? `rc-${rooms}-${adults}-${children}` : `rc-${rooms}-${adults}`;

    return (
      `https://ar.trivago.com/en-GB/lm/hotels-${slug}-sri-lanka` +
      `?search=200-${cityId};dr-${checkin}-${checkout};drs-40;${rc}`
    );
  },

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
    if (!originId || !destId) {
      const missing = [
        !originId ? slots.origin : null,
        !destId ? slots.destination : null,
      ].filter(Boolean).join(", ");
      throw new Error(`Unknown Magiya city — no ID mapping for: ${missing}`);
    }
    return (
      `https://magiya.lk/journeys/search?pickup_id=${originId}` +
      `&destination_id=${destId}` +
      `&date_of_journey=${slots.date || ""}` +
      `&from_city_name=${encodeURIComponent(capitalize(slots.origin || ""))}` +
      `&to_city_name=${encodeURIComponent(capitalize(slots.destination || ""))}` +
      `&pickup_id_proximity=5&destination_id_proximity=5&dep_time_order=0&operator_filter=0`
    );
  },

  // Confirmed against Qatar Airways' own generated search URL — every param
  // is a plain GET query string, no session tokens involved. Requires IATA
  // codes for fromStation/toStation, looked up via AIRPORT_IATA_CODES.
  "qatar-airways": (slots) => {
    const from = toIata(slots.origin || "");
    const to = toIata(slots.destination || "");
    if (!from || !to) {
      const missing = [
        !from ? slots.origin : null,
        !to ? slots.destination : null,
      ].filter(Boolean).join(", ");
      throw new Error(`Unknown airport — no IATA code mapping for: ${missing}`);
    }

    const isRoundTrip = slots.tripType === "round_trip";
    const adults = slots.passengers || "1";

    return (
      `https://www.qatarairways.com/app/booking/flight-selection` +
      `?widget=QR&searchType=F&addTaxToFare=Y&minPurTime=0&selLang=en` +
      `&tripType=${isRoundTrip ? "R" : "O"}` +
      `&fromStation=${from}` +
      `&toStation=${to}` +
      `&departing=${slots.date || ""}` +
      (isRoundTrip ? `&returning=${slots.returnDate || ""}` : "") +
      `&bookingClass=E&adults=${adults}&children=0&infants=0&ofw=0&teenager=0` +
      `&flexibleDate=off&allowRedemption=N`
    );
  },
};

// Known Magiya city IDs — extend this as you discover more by doing a
// manual search on magiya.lk and reading the resulting URL, same as before.
// Keys are lowercase and match the canonical spelling from towns.ts, even
// where Magiya's own site uses a different spelling (noted inline).
const MAGIYA_CITY_IDS: Record<string, string> = {
  batticaloa: "290",
  colombo: "1863", // Pettah Bus Stand — Magiya's ID for "Colombo" specifically
  hatton: "1504",
  kilinochchi: "1025",
  jaffna: "650",
  matale: "1330",
  panadura: "721",
  "nuwara eliya": "1535",
  badulla: "180",
  mannar: "1281",
  valaichchenai: "324", // Magiya's own label: "Valaichenai"
  ampara: "3",
  chilaw: "1592",
  ratnapura: "1768",
  ella: "202",
  balangoda: "1671",
  haputale: "213",
  monaragala: "1456",
  kegalle: "960",
  anuradhapura: "44",
  polonnaruwa: "1575",
  kattankudy: "299", // Magiya's own label: "Kattankudi"
  kuliyapitiya: "1124",
};

// Known Trivago city IDs (the number after "200-" in their search param).
const TRIVAGO_CITY_IDS: Record<string, string> = {
  colombo: "16098",
  negombo: "16097",
  kandy: "16106",
};

// City/place name -> IATA airport code, lowercase keys. Covers Sri Lanka's
// own airports plus common international destinations Qatar Airways flies
// (mostly via Doha). Extend as needed — same incremental pattern as
// MAGIYA_CITY_IDS and TRIVAGO_CITY_IDS.
const AIRPORT_IATA_CODES: Record<string, string> = {
  // Sri Lanka
  colombo: "CMB",
  bandaranaike: "CMB", // in case someone types the airport name itself
  jaffna: "JAF",
  trincomalee: "TRR",
  batticaloa: "BTC",
  hambantota: "HRI",

  // Common international destinations (Qatar Airways network)
  chennai: "MAA",
  mumbai: "BOM",
  delhi: "DEL",
  bangalore: "BLR",
  hyderabad: "HYD",
  kochi: "COK",
  dubai: "DXB",
  doha: "DOH",
  london: "LHR",
  singapore: "SIN",
  "kuala lumpur": "KUL",
  bangkok: "BKK",
  "hong kong": "HKG",
  sydney: "SYD",
  melbourne: "MEL",
  toronto: "YYZ",
  "new york": "JFK",
  paris: "CDG",
  frankfurt: "FRA",
  istanbul: "IST",
};

function toIata(place: string): string | null {
  return AIRPORT_IATA_CODES[(place || "").trim().toLowerCase()] || null;
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function toDDMMYYYY(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso; // not a valid YYYY-MM-DD, return as-is
  return `${day}-${month}-${year}`;
}

function slugify(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "-");
}

function toYYYYMMDD(iso: string): string {
  return iso.replace(/-/g, ""); // "2026-07-18" -> "20260718"
}

export function buildDeepLink(
  serviceSlug: string,
  externalUrl: string,
  slots: Record<string, string>,
  onFallback?: (reason: string) => void
): string {
  const template = DEEP_LINK_TEMPLATES[serviceSlug];
  if (template) {
    try {
      return template(slots);
    } catch (err) {
      onFallback?.(err instanceof Error ? err.message : "Unknown deep link error");
    }
  }

  try {
    const url = new URL(externalUrl);
    url.searchParams.set("ref", "24hourslk");
    for (const [key, value] of Object.entries(slots)) {
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return externalUrl;
  }
}