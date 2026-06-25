'use client';

import { useEffect } from 'react';

interface BodyScrollLockState {
  count: number;
  scrollY: number;
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  bodyLeft: string;
  bodyRight: string;
  htmlOverflow: string;
}

let lockState: BodyScrollLockState | null = null;

const lockBodyScroll = () => {
  const { body, documentElement } = document;
  const scrollY = window.scrollY;

  lockState = {
    count: 1,
    scrollY,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    htmlOverflow: documentElement.style.overflow,
  };

  documentElement.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
};

const unlockBodyScroll = () => {
  if (!lockState) return;

  lockState.count -= 1;
  if (lockState.count > 0) return;

  const { body, documentElement } = document;
  const scrollY = lockState.scrollY;

  documentElement.style.overflow = lockState.htmlOverflow;
  body.style.overflow = lockState.bodyOverflow;
  body.style.position = lockState.bodyPosition;
  body.style.top = lockState.bodyTop;
  body.style.width = lockState.bodyWidth;
  body.style.left = lockState.bodyLeft;
  body.style.right = lockState.bodyRight;

  lockState = null;
  window.scrollTo(0, scrollY);
};

export const useBodyScrollLock = () => {
  useEffect(() => {
    if (lockState) {
      lockState.count += 1;
    } else {
      lockBodyScroll();
    }

    return unlockBodyScroll;
  }, []);
};
