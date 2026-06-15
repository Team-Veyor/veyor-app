'use client';

import { useEffect, useState } from 'react';
import type { CreateAccountRequest } from '@/app/account/_types/types';
import { parseAccountFromText } from '@/app/account/_utils/parseAccountFromText';

/**
 * 마운트 시 클립보드를 한 번 읽어 계좌 정보를 파싱합니다.
 */
const useClipboardAccount = (banks: string[]) => {
  const [parsed, setParsed] = useState<Partial<CreateAccountRequest> | null>(null);

  useEffect(() => {
    if (banks.length === 0) return;
    if (!navigator.clipboard?.readText) return;

    let cancelled = false;

    navigator.clipboard
      .readText()
      .then((text) => {
        if (cancelled) return;
        setParsed(parseAccountFromText(text, banks));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [banks]);

  const clear = () => setParsed(null);

  return { parsed, clear };
};

export default useClipboardAccount;
