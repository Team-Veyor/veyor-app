'use client';

import * as amplitude from '@amplitude/unified';

type AmplitudeEventProperties = Record<string, string | number | boolean | null | undefined>;
type AmplitudeUserPropertyValue = string | number | boolean;
type AmplitudeUserProperties = Record<string, AmplitudeUserPropertyValue | null | undefined>;
type AmplitudeIdentify = InstanceType<typeof amplitude.Identify>;
type AmplitudeTab = 'home' | 'mypage';
type AmplitudeEntryPoint =
  | 'signup'
  | 'signup_personal_info'
  | 'signup_service_consent'
  | 'signup_onboarding'
  | 'home'
  | 'mypage'
  | 'my_page/account_management'
  | 'my_page/participation_history'
  | 'my_page/service_consent'
  | 'mypage_terms_of_service'
  | 'mypage_open_source_license'
  | 'complete_survey';
type AmplitudeExitPoint = AmplitudeEntryPoint;
type AmplitudeMypageMenuName =
  | 'chat_support'
  | 'service_consent'
  | 'terms_of_service'
  | 'open_source_license';
type AmplitudeShareChannel = 'kakao_open_chat' | 'kakao_talk' | 'instagram' | 'referral' | 'community' | 'other';
type AmplitudeCompletionErrorReason =
  | 'survey_expired'
  | 'tracking_param_lost'
  | 'already_participated'
  | 'target_response_count'
  | 'complete_unavailable';

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

export const getAmplitudeTab = (pathname: string): AmplitudeTab => {
  if (pathname.startsWith('/home')) return 'home';

  return 'mypage';
};

export const getAmplitudeExitPoint = (pathname: string): AmplitudeExitPoint => {
  if (pathname.startsWith('/home')) return 'home';
  if (pathname.startsWith('/user/account')) return 'my_page/account_management';
  if (pathname.startsWith('/user/participations')) return 'my_page/participation_history';
  if (pathname.startsWith('/policy/consents')) return 'my_page/service_consent';
  if (pathname.startsWith('/policy/terms')) return 'mypage_terms_of_service';
  if (pathname.startsWith('/policy/open-source')) return 'mypage_open_source_license';
  if (pathname.startsWith('/surveys/') && pathname.endsWith('/complete')) return 'complete_survey';
  if (pathname.startsWith('/onboarding')) return 'signup_onboarding';
  if (pathname.startsWith('/account/') && !pathname.endsWith('/new')) {
    return 'my_page/account_management';
  }
  if (pathname.startsWith('/user')) return 'mypage';

  return 'signup';
};

export const getAmplitudeMypageMenuName = (label: string): AmplitudeMypageMenuName | null => {
  switch (label) {
    case '채팅 상담 바로가기':
      return 'chat_support';
    case '서비스 이용 동의':
      return 'service_consent';
    case '이용 약관':
      return 'terms_of_service';
    case '오픈소스 라이선스':
      return 'open_source_license';
    default:
      return null;
  }
};

export const normalizeAmplitudeCompletionTime = (startedAt: number | null) => {
  if (!startedAt) return 0;

  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
};

export const getAmplitudeCompletionErrorReason = (
  error: Error,
): AmplitudeCompletionErrorReason | undefined => {
  if (!(error instanceof Error)) return undefined;

  if ('code' in error && typeof (error as { code?: string }).code === 'string') {
    const code = (error as { code?: string }).code;

    if (
      code === 'survey_expired' ||
      code === 'tracking_param_lost' ||
      code === 'already_participated' ||
      code === 'target_response_count' ||
      code === 'complete_unavailable'
    ) {
      return code;
    }
  }

  if (error instanceof Error && error.message === 'complete_unavailable') {
    return 'complete_unavailable';
  }

  return undefined;
};

export const AMPLITUDE_SHARE_CHANNELS = {
  kakao_open_chat: 'kakao_open_chat',
  kakao_talk: 'kakao_talk',
  instagram: 'instagram',
  referral: 'referral',
  community: 'community',
  other: 'other',
} as const satisfies Record<AmplitudeShareChannel, AmplitudeShareChannel>;

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
