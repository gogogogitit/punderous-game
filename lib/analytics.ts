export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      gaId: string,
      options?: Record<string, any>
    ) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const trackEvent = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      ...parameters,
      event_category: parameters?.category || 'Game',
      event_label: parameters?.label || JSON.stringify(parameters),
      value: parameters?.value,
    });
  }
};