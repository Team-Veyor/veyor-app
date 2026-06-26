'use client';

import * as amplitude from '@amplitude/unified';

type AmplitudeEventProperties = Record<string, string | number | boolean | null | undefined>;
type AmplitudeUserPropertyValue = string | number | boolean;
type AmplitudeUserProperties = Record<string, AmplitudeUserPropertyValue | null | undefined>;
type AmplitudeIdentify = InstanceType<typeof amplitude.Identify>;

let hasInitializedAmplitude = false;

export const initializeAmplitude = () => {
  if (hasInitializedAmplitude) return true;

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) return false;

  hasInitializedAmplitude = true;
  void amplitude.initAll(apiKey, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });

  return true;
};

export const identifyAmplitudeUser = (userId: string) => {
  if (!initializeAmplitude()) return;

  amplitude.setUserId(userId);
};

export const setAmplitudeUserProperties = (properties: AmplitudeUserProperties) => {
  updateAmplitudeUserProperties((identify) => {
    Object.entries(properties).forEach(([property, value]) => {
      if (value === null || value === undefined) return;

      identify.set(property, value);
    });
  });
};

export const updateAmplitudeUserProperties = (configure: (identify: AmplitudeIdentify) => void) => {
  if (!initializeAmplitude()) return;

  const identify = new amplitude.Identify();
  configure(identify);
  amplitude.identify(identify);
};

export const trackAmplitudeEvent = (
  eventName: string,
  eventProperties?: AmplitudeEventProperties,
) => {
  if (!initializeAmplitude()) return;

  amplitude.track(eventName, eventProperties);
};

export const trackAmplitudeEventOnce = (
  storageKey: string,
  eventName: string,
  eventProperties?: AmplitudeEventProperties,
) => {
  if (window.localStorage.getItem(storageKey)) return;

  window.localStorage.setItem(storageKey, 'true');
  trackAmplitudeEvent(eventName, eventProperties);
};
