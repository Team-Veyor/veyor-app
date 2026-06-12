'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { INTRO_SLIDES } from '@/app/onboarding/_constants/constants';
import Button from '@/components/Button/Button';
import { cn } from '@/lib/utils';

type SlideDirection = 'next' | 'prev';

const SLIDE_TRANSITION = {
  type: 'tween',
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
} as const;

const SLIDE_COUNT = INTRO_SLIDES.length;

const IntroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>('next');

  const router = useRouter();
  const currentSlide = INTRO_SLIDES[currentIndex];

  const changeSlide = (nextIndex: number) => {
    if (nextIndex === currentIndex || nextIndex < 0 || nextIndex >= SLIDE_COUNT) {
      return;
    }

    setDirection(nextIndex > currentIndex ? 'next' : 'prev');
    setCurrentIndex(nextIndex);
  };

  return (
    <section className='flex h-full flex-col px-[16px] pt-[36px]'>
      <div className='relative min-h-0 flex-1 overflow-hidden'>
        <AnimatePresence initial={false} custom={direction}>
          <motion.button
            key={currentSlide.id}
            type='button'
            custom={direction}
            initial={{ x: direction === 'next' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: direction === 'next' ? '-100%' : '100%' }}
            transition={SLIDE_TRANSITION}
            className='absolute inset-0 flex cursor-pointer flex-col text-left'
            onClick={() => changeSlide(currentIndex + 1)}
          >
            <div className='flex min-h-[104px] items-center justify-center text-center'>
              <h1 className='display-small whitespace-pre-line text-gray-950'>
                {currentSlide.title}
              </h1>
            </div>

            <div className='relative h-[380px] w-full overflow-hidden'>
              {/* TODO: 이미지 교체 */}
              <Image src='/dummy.png' alt={currentSlide.title} fill className='object-cover' />
            </div>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className='flex justify-center gap-[8px] py-[30px]'>
        {INTRO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type='button'
            aria-label={`백설기 ${index + 1}번째 소개`}
            aria-current={index === currentIndex ? 'step' : undefined}
            className={cn(
              'size-[10px] rounded-full transition-colors',
              index === currentIndex ? 'bg-gray-500' : 'bg-gray-300 hover:bg-gray-400',
            )}
            onClick={() => {
              changeSlide(index);
            }}
          />
        ))}
      </div>

      <Button variant='secondary' theme='dark' size='large' onClick={() => router.replace('/home')}>
        시작하기
      </Button>
    </section>
  );
};

export default IntroCarousel;
