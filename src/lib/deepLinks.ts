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

  // Confirmed against echannelling.com's own generated search URL.
  // hospital_code/isHospitalView only get added when a specific hospital
  // is chosen — omitted entirely for "any hospital" searches.
  "echannelling": (slots) => {
    const specCode = ECHANNELLING_SPECIALIZATIONS[(slots.specialty || "").toLowerCase()];
    if (!specCode) throw new Error(`Unknown specialization — no code mapping for: ${slots.specialty}`);

    const dateFormatted = toDDMMYYYY(slots.date || "");
    const hospitalCode = slots.hospital && slots.hospital.toLowerCase() !== "any"
      ? ECHANNELLING_HOSPITALS[slots.hospital.toLowerCase()]
      : null;

    return (
      `https://www.echannelling.com/doctor-search?isSpec=true` +
      (hospitalCode ? `&hospital_code=${hospitalCode}&isHospitalView=true` : "") +
      `&session_date=${dateFormatted}` +
      `&specialization=${encodeURIComponent(capitalize(slots.specialty || ""))}` +
      `&specialization_code=${specCode}`
    );
  },

  // Confirmed against doc.lk's own generated search URL. hospital=0 means
  // "any hospital" — confirmed directly from a real search. doctor is left
  // blank when no specific doctor name is given. date uses "Month D, YYYY"
  // format, URL-encoded (spaces -> +, comma -> %2C).
  // specialization code table is still being built — see DOC_LK_SPECIALIZATIONS.
  "doc-lk": (slots) => {
    const specCode = DOC_LK_SPECIALIZATIONS[(slots.specialty || "").toLowerCase()];
    if (!specCode) throw new Error(`Unknown Doc.lk specialization — no code mapping for: ${slots.specialty}`);

    const hospitalCode = slots.hospital && slots.hospital.toLowerCase() !== "any"
      ? DOC_LK_HOSPITALS[slots.hospital.toLowerCase()]
      : "0"; // 0 = any hospital, confirmed
    if (hospitalCode === undefined) {
      throw new Error(`Unknown Doc.lk hospital — no ID mapping for: ${slots.hospital}`);
    }

    const doctorName = slots.doctorName && slots.doctorName.toLowerCase() !== "any"
      ? slots.doctorName
      : "";

    const dateFormatted = toDocLkDate(slots.date || "");

    return (
      `https://www.doc.lk/search?doctor=${encodeURIComponent(doctorName)}` +
      `&hospital=${hospitalCode}` +
      `&specialization=${specCode}` +
      `&date=${encodeURIComponent(dateFormatted)}`
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

// City/place name -> IATA airport code, lowercase keys.
const AIRPORT_IATA_CODES: Record<string, string> = {
  colombo: "CMB",
  bandaranaike: "CMB",
  jaffna: "JAF",
  trincomalee: "TRR",
  batticaloa: "BTC",
  hambantota: "HRI",
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


// eChannelling specialization -> specialization_code. Only Cardiologist
// confirmed so far — extend by manually searching other specialties on
// echannelling.com and reading the resulting URL.
const ECHANNELLING_SPECIALIZATIONS: Record<string, string> = {
  cardiologist: "01",
};

// eChannelling hospital name -> hospital_code. Empty for now — only
// needed when a user picks a SPECIFIC hospital (not "any"). Extend by
// searching with a hospital selected and reading hospital_code from the URL.
const ECHANNELLING_HOSPITALS: Record<string, string> = {
  // e.g. "asiri central": "H03", // <- unconfirmed, verify before adding
};

// Doc.lk specialization -> specialization code. STILL NEEDS THE FIRST
// ENTRY — we know "4" is a valid code from a real search, but not which
// specialty it maps to. Fill this in once confirmed.
// Doc.lk specialization name -> code. Confirmed from real searches.
const DOC_LK_SPECIALIZATIONS: Record<string, string> = {
  cardiologist: "4",
  acupuncture: "195",
  neurologist: "149",
  psychiatrist: "29",
  "dental surgeon": "46",
  // "10" is confirmed valid but its specialty name isn't known yet —
  // add it once confirmed (was seen with Rajagiriya Hospital, Dambulla).
};

// Doc.lk hospital name -> ID. "0" = any hospital, confirmed separately
// in the doc-lk template itself. Confirmed from real searches.
const DOC_LK_HOSPITALS: Record<string, string> = {
  "asiri hospital - kandy": "121",
  "durdans hospital - colombo 03": "145",
  "jdr hospital - jaffna": "367",
  "kings hospital - colombo 05": "128",
  "new mount hospital - hatton": "217",
  "rajagiriya hospital (pvt) ltd - dambulla": "341",
};

function toIata(place: string): string | null {
  return AIRPORT_IATA_CODES[(place || "").trim().toLowerCase()] || null;
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function toDDMMYYYY(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}-${month}-${year}`;
}

function slugify(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "-");
}

function toYYYYMMDD(iso: string): string {
  return iso.replace(/-/g, "");
}

// Doc.lk wants "Month D, YYYY" e.g. "July 18, 2026" — matches what their
// own search form produces, confirmed from a real generated URL.
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
function toDocLkDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  const monthName = MONTH_NAMES[Number(month) - 1];
  if (!monthName) return iso;
  return `${monthName} ${Number(day)}, ${year}`;
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