'use client';

import * as amplitude from '@amplitude/unified';

const initAmplitude = () => {
  if (typeof window !== 'undefined') {
    amplitude.initAll('', { analytics: { autocapture: true }, sessionReplay: { sampleRate: 1 } });
  }
};

initAmplitude();

export const Amplitude = () => null;
export default amplitude;
