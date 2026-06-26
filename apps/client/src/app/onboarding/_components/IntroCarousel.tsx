'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { useRef, useState } from 'react';
import { INTRO_SLIDES } from '@/app/onboarding/_constants/constants';
import Button from '@/components/Button/Button';
import { trackAmplitudeEvent } from '@/lib/amplitude';
import { cn } from '@/lib/utils';

type SlideDirection = 'next' | 'prev';
type SlideInteraction = 'click' | 'drag';

const SMART_ANIMATE_TRANSITION = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeOut',
} as const;

const SLIDE_TRANSITIONS = {
  click: SMART_ANIMATE_TRANSITION,
  drag: SMART_ANIMATE_TRANSITION,
} as const;

const SLIDE_VARIANTS = {
  enter: (direction: SlideDirection) => ({
    x: direction === 'next' ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction: SlideDirection) => ({
    x: direction === 'next' ? '-100%' : '100%',
  }),
};

const SLIDE_COUNT = INTRO_SLIDES.length;
const DRAG_OFFSET_THRESHOLD = 50;
const DRAG_VELOCITY_THRESHOLD = 500;

const IntroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>('next');
  const [interaction, setInteraction] = useState<SlideInteraction>('click');
  const hasDraggedRef = useRef(false);

  const router = useRouter();
  const currentSlide = INTRO_SLIDES[currentIndex];

  const changeSlide = (nextIndex: number, nextInteraction: SlideInteraction) => {
    if (nextIndex === currentIndex || nextIndex < 0 || nextIndex >= SLIDE_COUNT) {
      return;
    }

    setDirection(nextIndex > currentIndex ? 'next' : 'prev');
    setInteraction(nextInteraction);
    setCurrentIndex(nextIndex);
  };

  const handleSlideClickCapture = (event: MouseEvent<HTMLButtonElement>) => {
    if (hasDraggedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      hasDraggedRef.current = false;
    }
  };

  const handleSlideClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const isPrevClick = event.clientX - left < width / 2;

    changeSlide(currentIndex + (isPrevClick ? -1 : 1), 'click');
  };

  return (
    <section className='flex h-full flex-col px-16 pt-36'>
      <div className='relative min-h-0 flex-1 overflow-hidden'>
        <AnimatePresence initial={false} custom={direction}>
          <motion.button
            key={currentSlide.id}
            type='button'
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial='enter'
            animate='center'
            exit='exit'
            transition={SLIDE_TRANSITIONS[interaction]}
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={() => {
              hasDraggedRef.current = true;
            }}
            onDragEnd={(_, info) => {
              const isSwipeNext =
                info.offset.x < -DRAG_OFFSET_THRESHOLD ||
                info.velocity.x < -DRAG_VELOCITY_THRESHOLD;
              const isSwipePrev =
                info.offset.x > DRAG_OFFSET_THRESHOLD || info.velocity.x > DRAG_VELOCITY_THRESHOLD;

              if (isSwipeNext) {
                changeSlide(currentIndex + 1, 'drag');
              } else if (isSwipePrev) {
                changeSlide(currentIndex - 1, 'drag');
              }
            }}
            className='absolute inset-0 flex cursor-pointer touch-pan-y flex-col text-left'
            onClickCapture={handleSlideClickCapture}
            onClick={handleSlideClick}
          >
            <div className='flex min-h-[104px] items-center justify-center text-center'>
              <h1 className='display-small whitespace-pre-line text-gray-950'>
                {currentSlide.title}
              </h1>
            </div>

            <div className='pointer-events-none relative flex size-full items-center justify-center overflow-hidden'>
              <Image
                src={currentSlide.imageSrc}
                alt={currentSlide.title}
                width={375}
                height={380}
                draggable={false}
                className='object-cover object-center'
              />
            </div>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className='flex justify-center gap-8 py-[30px]'>
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
              changeSlide(index, 'click');
            }}
          />
        ))}
      </div>

      <Button
        variant='secondary'
        theme='dark'
        size='large'
        onClick={() => {
          trackAmplitudeEvent('start_clicked');
          router.replace('/home');
        }}
      >
        시작하기
      </Button>
    </section>
  );
};

export default IntroCarousel;
