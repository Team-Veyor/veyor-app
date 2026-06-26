'use client';

import * as amplitude from '@amplitude/unified';

type AmplitudeEventProperties = Record<string, string | number | boolean | null | undefined>;

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
