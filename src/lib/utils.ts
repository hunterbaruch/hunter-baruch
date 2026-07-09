export function trackEvent(name: string, payload?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: name, ...payload });
    }
  } catch (e) {
    // swallow errors in analytics helper
  }
}

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
