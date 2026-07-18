// lib/towns.ts
// Canonical list of Sri Lankan towns/cities used for fuzzy-matching
// user input (origin/destination) against known place names.
// Organized by province purely for readability/maintenance — the
// exported array is flat since matching doesn't care about grouping.

const WESTERN_PROVINCE = [
  "Colombo",
  "Dehiwala-Mount Lavinia",
  "Moratuwa",
  "Sri Jayawardenepura Kotte",
  "Negombo",
  "Gampaha",
  "Kelaniya",
  "Kesbewa",
  "Maharagama",
  "Kaduwela",
  "Wattala",
  "Ja-Ela",
  "Kalutara",
  "Panadura",
  "Horana",
  "Beruwala",
  "Aluthgama",
];

const CENTRAL_PROVINCE = [
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Gampola",
  "Nawalapitiya",
  "Hatton",
  "Talawakele",
  "Dambulla",
  "Kadugannawa",
  "Wattegama",
];

const SOUTHERN_PROVINCE = [
  "Galle",
  "Matara",
  "Hambantota",
  "Tangalle",
  "Weligama",
  "Ambalangoda",
  "Hikkaduwa",
  "Akuressa",
  "Tissamaharama",
  "Mirissa",
  "Balapitiya",
  "Koggala",
];

const NORTHERN_PROVINCE = [
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Point Pedro",
  "Chavakachcheri",
];

const EASTERN_PROVINCE = [
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kalmunai",
  "Kattankudy",
  "Kinniya",
  "Valaichchenai",
  "Akkaraipattu",
];

const NORTH_WESTERN_PROVINCE = [
  "Kurunegala",
  "Puttalam",
  "Chilaw",
  "Kuliyapitiya",
  "Wariyapola",
  "Nikaweratiya",
  "Anamaduwa",
];

const NORTH_CENTRAL_PROVINCE = [
  "Anuradhapura",
  "Polonnaruwa",
  "Medirigiriya",
  "Kekirawa",
  "Tambuttegama",
];

const UVA_PROVINCE = [
  "Badulla",
  "Bandarawela",
  "Ella",
  "Monaragala",
  "Wellawaya",
  "Haputale",
  "Welimada",
  "Mahiyanganaya",
];

const SABARAGAMUWA_PROVINCE = [
  "Ratnapura",
  "Kegalle",
  "Embilipitiya",
  "Balangoda",
  "Rambukkana",
  "Warakapola",
];

export const SRI_LANKA_TOWNS: string[] = [
  ...WESTERN_PROVINCE,
  ...CENTRAL_PROVINCE,
  ...SOUTHERN_PROVINCE,
  ...NORTHERN_PROVINCE,
  ...EASTERN_PROVINCE,
  ...NORTH_WESTERN_PROVINCE,
  ...NORTH_CENTRAL_PROVINCE,
  ...UVA_PROVINCE,
  ...SABARAGAMUWA_PROVINCE,
];

// Common alternate spellings / abbreviations users actually type.
// Maps variant (lowercase) -> canonical name. Checked BEFORE fuzzy
// matching, so these resolve instantly and exactly, no edit-distance
// guessing needed.
export const TOWN_ALIASES: Record<string, string> = {
  "colombo 1": "Colombo",
  "colombo 7": "Colombo",
  "col": "Colombo",
  "kandy town": "Kandy",
  "jaffna town": "Jaffna",
  "nuwara eliya town": "Nuwara Eliya",
  "kilinochi": "Kilinochchi",
  "killinochchi": "Kilinochchi",
  "batticalo": "Batticaloa",
  "batticoloa": "Batticaloa",
  "trinco": "Trincomalee",
  "trincomali": "Trincomalee",
  "nuwaraeliya": "Nuwara Eliya",
  "nuweraeliya": "Nuwara Eliya",
  "moneragala": "Monaragala",
  "mahiyangana": "Mahiyanganaya",
  "hambantota port": "Hambantota",
  "dehiwala": "Dehiwala-Mount Lavinia",
  "mount lavinia": "Dehiwala-Mount Lavinia",
  "kotte": "Sri Jayawardenepura Kotte",
};

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
  valaichchenai: "324", // Magiya labels this "Valaichenai" (their spelling) — mapped to our canonical "Valaichchenai"
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
  kattankudy: "299", // Magiya labels this "Kattankudi" (their spelling) — mapped to our canonical "Kattankudy"
  kuliyapitiya: "1124",
};

