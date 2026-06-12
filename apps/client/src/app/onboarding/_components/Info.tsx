'use client';

import { useState } from 'react';
import AgreementBottomSheet from '@/app/onboarding/_components/AgreementBottomSheet';
import IntroCarousel from '@/app/onboarding/_components/IntroCarousel';
import { AGREEMENT_ITEMS, GENDER_OPTIONS } from '@/app/onboarding/_constants/constants';
import useOnboardingMutation from '@/app/onboarding/_hooks/useOnboardingMutation';
import type { AgreementId, Gender } from '@/app/onboarding/_types/types';
import { createConsents } from '@/app/onboarding/_utils/onboarding';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import RadioButton from '@/components/Radio/RadioButton';
import { toIntegerOrNull } from '@/lib/utils';

type OnboardingStep = 'info' | 'intro';

type OnboardingForm = {
  gender: Gender | null;
  birthYear: number | null;
};

const INITIAL_FORM: OnboardingForm = {
  gender: null,
  birthYear: null,
};

const Info = () => {
  const onboardingMutation = useOnboardingMutation();

  const [form, setForm] = useState<OnboardingForm>(INITIAL_FORM);
  const [isAgreeBottomSheetOpen, setIsAgreeBottomSheetOpen] = useState(false);

  const [step, setStep] = useState<OnboardingStep>('info');

  const isNextButtonDisabled = !form.gender || !form.birthYear || onboardingMutation.isPending;

  const showIntro = () => {
    setIsAgreeBottomSheetOpen(false);
    setStep('intro');
  };

  const handleAgreementSubmit = (agreedIds: AgreementId[]) => {
    if (!form.birthYear || !form.gender) return;

    onboardingMutation.mutate(
      {
        birthYear: form.birthYear,
        gender: form.gender,
        consents: createConsents(agreedIds),
      },
      {
        onSuccess: showIntro,
      },
    );
  };

  if (step === 'intro') {
    return <IntroCarousel />;
  }

  return (
    <div className='flex flex-col h-full pt-[24px] gap-[16px] px-[16px]'>
      <h1 className='title-medium pb-[8px]'>기본 정보를 입력해주세요</h1>
      <Input
        type='number'
        inputMode='numeric'
        placeholder='출생연도'
        value={form.birthYear ?? ''}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, birthYear: toIntegerOrNull(e.target.value) }))
        }
      />

      <div className='flex w-full gap-[8px]'>
        {GENDER_OPTIONS.map((option) => (
          <RadioButton
            key={option.value}
            label={option.label}
            name='gender'
            value={option.value}
            variant='outlined'
            hasRightIcon
            checked={form.gender === option.value}
            onChange={() =>
              setForm((prev) => ({
                ...prev,
                gender: option.value,
              }))
            }
          />
        ))}
      </div>

      <Button
        variant='secondary'
        theme='dark'
        size='large'
        className='mt-auto'
        disabled={isNextButtonDisabled}
        onClick={() => setIsAgreeBottomSheetOpen(true)}
      >
        다음
      </Button>

      {isAgreeBottomSheetOpen && (
        <AgreementBottomSheet
          items={AGREEMENT_ITEMS}
          onSubmit={handleAgreementSubmit}
          onClose={() => setIsAgreeBottomSheetOpen(false)}
        />
      )}
    </div>
  );
};

export default Info;
