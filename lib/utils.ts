type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (
      command: 'event',
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      event_category: parameters?.category || 'engagement',
      event_label: parameters?.label || undefined,
      value: parameters?.value || undefined,
    });
  }
};