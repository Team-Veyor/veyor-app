'use client';

import { useState } from 'react';
import BankSelectBottomSheet from '@/app/account/_components/BankSelectBottomSheet';
import { getBankLogo } from '@/app/account/_constants/banks';
import useAccountForm from '@/app/account/_hooks/useAccountForm';
import useBanks from '@/app/account/_hooks/useBanks';
import type { CreateAccountRequest } from '@/app/account/_types/types';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import { cn } from '@/lib/utils';

interface AccountFormProps {
  /** 폼 초기값. 수정 페이지에서 기존 계좌 정보를 채울 때 사용합니다. */
  initialForm?: Partial<CreateAccountRequest>;
  /** 계좌번호 입력의 placeholder. 수정 시 마스킹된 계좌번호를 노출합니다. */
  accountNoPlaceholder?: string;
  /** 저장 진행 중 여부. 버튼 비활성화에 사용됩니다. */
  isSubmitting?: boolean;
  /** 저장 버튼 클릭 시 채워진 폼 값을 전달받는 콜백 */
  onSubmit: (form: CreateAccountRequest) => void;
}

const AccountForm = ({
  initialForm,
  accountNoPlaceholder = '계좌번호',
  isSubmitting = false,
  onSubmit,
}: AccountFormProps) => {
  const { data: banks = [] } = useBanks();

  const [isBankSheetOpen, setIsBankSheetOpen] = useState(false);

  const { form, setBank, handleHolderNameChange, handleAccountNoChange, isFormFilled } =
    useAccountForm(initialForm);

  const selectedBankLabel = form.bank ? getBankLogo(form.bank).label : null;

  const handleSave = () => {
    if (!isFormFilled || isSubmitting) return;

    onSubmit(form);
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
    </>
  );
};

export default AccountForm;
