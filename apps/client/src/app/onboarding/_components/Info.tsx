'use client';

import { type ChangeEvent, useState } from 'react';
import AgreementBottomSheet from '@/app/onboarding/_components/AgreementBottomSheet';
import IntroCarousel from '@/app/onboarding/_components/IntroCarousel';
import {
  AGREEMENT_ITEMS,
  BIRTH_YEAR_HELPER_TEXT,
  GENDER_OPTIONS,
  OCCUPATION_BOTTOM_SHEET,
  OCCUPATION_OPTIONS,
} from '@/app/onboarding/_constants/constants';
import useOnboardingMutation from '@/app/onboarding/_hooks/useOnboardingMutation';
import type { AgreementId, Gender, Occupation } from '@/app/onboarding/_types/types';
import {
  createConsents,
  getBirthYearError,
  isValidBirthYear,
} from '@/app/onboarding/_utils/onboarding';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import RadioButton from '@/components/Radio/RadioButton';
import Select from '@/components/Select/Select';

type OnboardingStep = 'info' | 'intro';

type OnboardingForm = {
  gender: Gender | null;
  birthYear: number | null;
  occupation: Occupation | null;
};

const INITIAL_FORM: OnboardingForm = {
  gender: null,
  birthYear: null,
  occupation: null,
};

const Info = () => {
  const [form, setForm] = useState<OnboardingForm>(INITIAL_FORM);
  const [birthYearInput, setBirthYearInput] = useState('');
  const [isBirthYearFocused, setIsBirthYearFocused] = useState(false);
  const [isAgreeBottomSheetOpen, setIsAgreeBottomSheetOpen] = useState(false);

  const [step, setStep] = useState<OnboardingStep>('info');

  const onboardingMutation = useOnboardingMutation();

  const shouldValidateBirthYear = birthYearInput.length > 0 && !isBirthYearFocused;
  const birthYearError = shouldValidateBirthYear ? getBirthYearError(birthYearInput) : null;
  const birthYearHelperText = BIRTH_YEAR_HELPER_TEXT[birthYearError ?? 'default'];
  const isNextButtonDisabled =
    !form.gender || !form.birthYear || !form.occupation || onboardingMutation.isPending;

  const handleBirthYearChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 4);
    setBirthYearInput(digitsOnly);
    setForm((prev) => ({
      ...prev,
      birthYear: isValidBirthYear(digitsOnly) ? Number(digitsOnly) : null,
    }));
  };

  const showIntro = () => {
    setIsAgreeBottomSheetOpen(false);
    setStep('intro');
  };

  const handleAgreementSubmit = (agreedIds: AgreementId[]) => {
    if (!form.birthYear || !form.gender || !form.occupation) return;

    // 필수 약관 재검증: 버튼 비활성(UI 상태)에만 의존하지 않고 제출 시점에 한 번 더 막는다.
    const agreedSet = new Set(agreedIds);
    const allRequiredAgreed = AGREEMENT_ITEMS.filter((item) => item.required).every((item) =>
      agreedSet.has(item.id),
    );
    if (!allRequiredAgreed) return;

    onboardingMutation.mutate(
      {
        birthYear: form.birthYear,
        gender: form.gender,
        occupation: form.occupation,
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
    <div className='flex flex-col h-full pt-24 gap-16 px-16'>
      <h1 className='title-medium pb-8'>기본 정보를 입력해주세요</h1>

      <div className='flex flex-col gap-8'>
        <label htmlFor='gender' className='label-medium text-text-primary'>
          성별
        </label>
        <div className='flex w-full gap-8'>
          {GENDER_OPTIONS.map((option) => (
            <div key={option.value} className='flex-1 [&>label]:flex [&>label>span]:w-full'>
              <RadioButton
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
            </div>
          ))}
        </div>
      </div>

      <Select
        label='직업 상태'
        title={OCCUPATION_BOTTOM_SHEET.title}
        description={OCCUPATION_BOTTOM_SHEET.description}
        placeholder='직업 상태를 선택해 주세요'
        options={OCCUPATION_OPTIONS}
        value={form.occupation ?? ''}
        onChange={(value) => setForm((prev) => ({ ...prev, occupation: value as Occupation }))}
      />

      <Input
        type='text'
        inputMode='numeric'
        pattern='[0-9]*'
        maxLength={4}
        label='출생연도'
        placeholder='출생연도를 입력해 주세요'
        helperText={birthYearHelperText}
        error={birthYearError !== null}
        value={birthYearInput}
        onFocus={() => setIsBirthYearFocused(true)}
        onBlur={() => setIsBirthYearFocused(false)}
        onChange={handleBirthYearChange}
      />

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
