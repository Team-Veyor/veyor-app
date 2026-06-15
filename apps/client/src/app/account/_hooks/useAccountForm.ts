'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { CreateAccountRequest } from '@/app/account/_types/types';

const EMPTY_FORM: CreateAccountRequest = {
  bank: '',
  holderName: '',
  accountNo: '',
};

const useAccountForm = (initialForm?: Partial<CreateAccountRequest>) => {
  const [form, setForm] = useState<CreateAccountRequest>({ ...EMPTY_FORM, ...initialForm });

  const setBank = (bank: string) => {
    setForm((prev) => ({ ...prev, bank }));
  };

  const handleHolderNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, holderName: event.target.value }));
  };

  const handleAccountNoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, accountNo: event.target.value }));
  };

  const prefill = (values: Partial<CreateAccountRequest>) => {
    setForm((prev) => ({ ...prev, ...values }));
  };

  const isFormFilled = Boolean(form.bank && form.accountNo && form.holderName);

  return {
    form,
    setBank,
    handleHolderNameChange,
    handleAccountNoChange,
    prefill,
    isFormFilled,
  };
};

export default useAccountForm;
