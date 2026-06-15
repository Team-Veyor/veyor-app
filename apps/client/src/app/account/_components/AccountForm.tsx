'use client';

import { useState } from 'react';
import BankSelectBottomSheet from '@/app/account/_components/BankSelectBottomSheet';
import { getBankLogo } from '@/app/account/_constants/banks';
import useAccountForm from '@/app/account/_hooks/useAccountForm';
import useBanks from '@/app/account/_hooks/useBanks';
import useClipboardAccount from '@/app/account/_hooks/useClipboardAccount';
import type { CreateAccountRequest } from '@/app/account/_types/types';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { cn } from '@/lib/utils';

interface AccountFormProps {
  initialForm?: Partial<CreateAccountRequest>;
  accountNoPlaceholder?: string;
  isSubmitting?: boolean;
  onSubmit: (form: CreateAccountRequest) => void;
}

const AccountForm = ({
  initialForm,
  accountNoPlaceholder = '계좌번호',
  isSubmitting = false,
  onSubmit,
}: AccountFormProps) => {
  const [isBankSheetOpen, setIsBankSheetOpen] = useState(false);

  const { data: banks = [] } = useBanks();
  const { parsed, clear } = useClipboardAccount(banks);
  const { form, setBank, handleHolderNameChange, handleAccountNoChange, prefill, isFormFilled } =
    useAccountForm(initialForm);

  const selectedBankLabel = form.bank ? getBankLogo(form.bank).label : null;

  const handleSave = () => {
    if (!isFormFilled || isSubmitting) return;

    onSubmit(form);
  };

  const handleApplyClipboard = () => {
    if (parsed) prefill(parsed);
    clear();
  };

  return (
    <>
      <div className='flex flex-col gap-16'>
        <Input placeholder='예금주명' value={form.holderName} onChange={handleHolderNameChange} />
        <Input
          placeholder={accountNoPlaceholder}
          value={form.accountNo}
          onChange={handleAccountNoChange}
        />
        <button
          type='button'
          onClick={() => setIsBankSheetOpen(true)}
          className={cn(
            'flex w-full items-center justify-between gap-12 rounded-16 border border-gray-200 bg-white p-16 transition-colors',
            isBankSheetOpen && 'border-gray-900',
          )}
        >
          <span
            className={cn(
              'body-large-strong text-left',
              selectedBankLabel ? 'text-gray-900' : 'text-gray-500',
            )}
          >
            {selectedBankLabel ?? '은행'}
          </span>
          <ChevronDownIcon className='size-24 shrink-0 text-gray-500' />
        </button>
      </div>

      {isBankSheetOpen && (
        <BankSelectBottomSheet
          banks={banks}
          selectedBank={form.bank}
          onConfirm={(bank) => {
            setBank(bank);
            setIsBankSheetOpen(false);
          }}
          onClose={() => setIsBankSheetOpen(false)}
        />
      )}
      <Button
        variant='secondary'
        theme='dark'
        size='large'
        className='mt-auto'
        onClick={handleSave}
        disabled={!isFormFilled || isSubmitting}
      >
        저장
      </Button>

      {parsed && (
        <ConfirmModal
          title='계좌번호를 자동으로 입력할까요?'
          description='복사한 계좌정보가 있어요.'
          leftButtonText='아니요'
          rightButtonText='예'
          onLeftButtonClick={clear}
          onRightButtonClick={handleApplyClipboard}
        />
      )}
    </>
  );
};

export default AccountForm;
