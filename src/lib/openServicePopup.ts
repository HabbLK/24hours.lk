/**
 * Open a partner booking URL in a centered popup window so users stay
 * connected to 24hours.lk. Falls back to a normal new tab if the browser
 * blocks popups.
 */
export function openServicePopup(url: string, name = "24hours-service"): Window | null {
  if (typeof window === "undefined") return null;

  const width = Math.min(1100, Math.max(720, Math.round(window.screen.availWidth * 0.85)));
  const height = Math.min(800, Math.max(560, Math.round(window.screen.availHeight * 0.85)));
  const left = Math.max(0, Math.round((window.screen.availWidth - width) / 2 + (window.screenX || 0)));
  const top = Math.max(0, Math.round((window.screen.availHeight - height) / 2 + (window.screenY || 0)));

  // Do not put noopener/noreferrer in features — that makes open() return null
  // even when the popup succeeds. Sever opener manually instead.
  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "scrollbars=yes",
    "resizable=yes",
  ].join(",");

  const popup = window.open(url, name.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64), features);

  // Do not fall back to a new tab here — Edge often turns sized popups into
  // tabs anyway, and callers prefer an in-page embed with an explicit choice.
  if (!popup || popup.closed) {
    return null;
  }

  try {
    popup.opener = null;
    popup.focus();
  } catch {
    // Cross-origin focus / opener can throw in some browsers; ignore.
  }

  return popup;
}
