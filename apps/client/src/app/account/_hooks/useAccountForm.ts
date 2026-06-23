'use client';

import type { ChangeEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import type { CreateAccountRequest } from '@/app/account/_types/types';

export type AccountFormMode = 'create' | 'edit';
export type AccountFormField = keyof CreateAccountRequest;

const EMPTY_FORM: CreateAccountRequest = {
  bank: '',
  holderName: '',
  accountNo: '',
};

interface UseAccountFormOptions {
  mode?: AccountFormMode;
  initialForm?: Partial<CreateAccountRequest>;
}

const useAccountForm = ({ mode = 'create', initialForm }: UseAccountFormOptions = {}) => {
  const baseFormRef = useRef<CreateAccountRequest>({ ...EMPTY_FORM, ...initialForm });
  const [form, setForm] = useState<CreateAccountRequest>(baseFormRef.current);

  const setField = <K extends AccountFormField>(field: K, value: CreateAccountRequest[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (field: Exclude<AccountFormField, 'bank'>) => {
    return (event: ChangeEvent<HTMLInputElement>) => setField(field, event.target.value);
  };

  const prefill = (values: Partial<CreateAccountRequest>) => {
    setForm((prev) => ({ ...prev, ...values }));
  };

  const changes = useMemo<Partial<CreateAccountRequest>>(() => {
    const base = baseFormRef.current;
    const diff: Partial<CreateAccountRequest> = {};
    if (form.bank !== base.bank) diff.bank = form.bank;
    if (form.holderName !== base.holderName) diff.holderName = form.holderName;
    if (form.accountNo !== base.accountNo) diff.accountNo = form.accountNo;
    return diff;
  }, [form]);

  const isDirty = Object.keys(changes).length > 0;
  const isFormFilled = Boolean(form.bank && form.accountNo && form.holderName);

  const canSave =
    mode === 'edit' ? isDirty && Boolean(form.bank) && Boolean(form.holderName) : isFormFilled;

  return {
    form,
    setField,
    handleFieldChange,
    prefill,
    changes,
    isDirty,
    isFormFilled,
    canSave,
  };
};

export default useAccountForm;
