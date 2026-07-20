// Xpress.jobs location -> Locations code. Extend by manually searching a
// city on xpress.jobs and reading the Locations param from the URL, same
// pattern as MAGIYA_CITY_IDS / TRIVAGO_CITY_IDS.
export const XPRESS_LOCATIONS: Record<string, string> = {
  colombo: "15",
  kandy: "20",
};

// Xpress.jobs sector/category -> Sectors code. Only one confirmed so far.
export const XPRESS_SECTORS: Record<string, string> = {
  "accountancy and finance": "1",
};