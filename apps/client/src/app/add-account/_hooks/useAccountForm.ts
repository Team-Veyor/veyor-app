'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { CreateAccountRequest } from '@/app/add-account/_types/types';

const INITIAL_FORM: CreateAccountRequest = {
  bank: '',
  holderName: '',
  accountNo: '',
};

const useAccountForm = () => {
  const [form, setForm] = useState<CreateAccountRequest>(INITIAL_FORM);

  const setBank = (bank: string) => {
    setForm((prev) => ({ ...prev, bank }));
  };

  const handleHolderNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, holderName: event.target.value }));
  };

  const handleAccountNoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, accountNo: event.target.value }));
  };

  const isFormFilled = Boolean(form.bank && form.accountNo && form.holderName);

  return {
    form,
    setBank,
    handleHolderNameChange,
    handleAccountNoChange,
    isFormFilled,
  };
};

export default useAccountForm;
