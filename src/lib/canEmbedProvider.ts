/**
 * Providers that send X-Frame-Options / CSP frame-ancestors and cannot
 * load in our iframe. For these we open a new tab instead.
 */
const NON_EMBEDDABLE_HOST_FRAGMENTS = [
  "agoda.com",
  "booking.com",
  "trivago.com",
  "airbnb.com",
  "qatarairways.com",
  "emirates.com",
  "srilankan.com",
  "uber.com",
  "ubereats.com",
  "pickme.lk",
  "busseat.lk",
  "magiya.lk",
  "echannelling.com",
  "doc.lk",
  "durdans.com",
  "google.com",
  "facebook.com",
];

export function canEmbedProviderUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return !NON_EMBEDDABLE_HOST_FRAGMENTS.some(
      (fragment) => host === fragment || host.endsWith(`.${fragment}`)
    );
  } catch {
    return false;
  }
}
