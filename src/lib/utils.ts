export function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function trackEvent(name: string, payload?: Record<string, unknown>) {
  try {
    const analyticsWindow = window as AnalyticsWindow;
    if (typeof window !== "undefined" && analyticsWindow.dataLayer) {
      analyticsWindow.dataLayer.push({ event: name, ...payload });
    }
  } catch {
    // swallow errors in analytics helper
  }
}

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
