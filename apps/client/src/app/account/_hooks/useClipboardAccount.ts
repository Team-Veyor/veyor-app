'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CreateAccountRequest } from '@/app/account/_types/types';
import { parseAccountFromText } from '@/app/account/_utils/parseAccountFromText';

/**
 * 클립보드에서 계좌 정보를 읽어 파싱합니다.
 */
const useClipboardAccount = (banks: string[]) => {
  const [parsed, setParsed] = useState<Partial<CreateAccountRequest> | null>(null);
  const isReadingRef = useRef(false);
  const hasGestureReadRef = useRef(false);

  const readClipboard = useCallback(
    async ({ fromGesture = false }: { fromGesture?: boolean } = {}) => {
      if (banks.length === 0) return;
      if (!navigator.clipboard?.readText) return;
      if (isReadingRef.current) return;
      if (fromGesture && hasGestureReadRef.current) return;

      if (fromGesture) {
        hasGestureReadRef.current = true;
      }

      isReadingRef.current = true;

      try {
        const text = await navigator.clipboard.readText();
        setParsed(parseAccountFromText(text, banks));
      } catch {
        // 클립보드 권한이 거부되거나 사용자 제스처가 없으면 조용히 무시합니다.
      } finally {
        isReadingRef.current = false;
      }
    },
    [banks],
  );

  useEffect(() => {
    void readClipboard();
  }, [readClipboard]);

  const parseText = useCallback(
    (text: string) => {
      setParsed(parseAccountFromText(text, banks));
    },
    [banks],
  );

  const clear = () => setParsed(null);
  const readFromUserGesture = () => readClipboard({ fromGesture: true });

  return { parsed, clear, parseText, readFromUserGesture };
};

export default useClipboardAccount;
