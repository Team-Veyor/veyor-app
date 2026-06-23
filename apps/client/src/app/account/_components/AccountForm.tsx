'use client';

import { type ClipboardEvent, useState } from 'react';
import BankSelectBottomSheet from '@/app/account/_components/BankSelectBottomSheet';
import { getBankLogo } from '@/app/account/_constants/banks';
import useAccountForm from '@/app/account/_hooks/useAccountForm';
import useBanks from '@/app/account/_hooks/useBanks';
import useClipboardAccount from '@/app/account/_hooks/useClipboardAccount';
import type { CreateAccountRequest } from '@/app/account/_types/types';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import Select from '@/components/Select/Select';

interface AccountFormBaseProps {
  initialForm?: Partial<CreateAccountRequest>;
  accountNoPlaceholder?: string;
  isSubmitting?: boolean;
}

interface CreateAccountFormProps extends AccountFormBaseProps {
  mode?: 'create';
  onSubmit: (form: CreateAccountRequest) => void;
}

interface EditAccountFormProps extends AccountFormBaseProps {
  mode: 'edit';
  onSubmit: (changes: Partial<CreateAccountRequest>) => void;
}

type AccountFormProps = CreateAccountFormProps | EditAccountFormProps;

const AccountForm = (props: AccountFormProps) => {
  const { initialForm, accountNoPlaceholder = '계좌번호', isSubmitting = false } = props;
  const mode = props.mode ?? 'create';
  const [isAccountNoBlurred, setIsAccountNoBlurred] = useState(false);

  const { data: banks = [] } = useBanks();
  const { parsed, clear, parseText, readFromUserGesture } = useClipboardAccount(banks);
  const { form, setField, handleFieldChange, prefill, changes, canSave } = useAccountForm({
    mode,
    initialForm,
  });

  const bankOptions = banks.map((bank) => ({
    value: bank,
    label: getBankLogo(bank).label,
  }));
  const hasAccountNoError = /\D/.test(form.accountNo);
  const showAccountNoError = isAccountNoBlurred && hasAccountNoError;
  const accountNoHelperText = showAccountNoError
    ? '계좌번호는 숫자만 입력 가능합니다.'
    : `'-' 없이 숫자만 입력`;
  const isSaveDisabled = !canSave || hasAccountNoError || isSubmitting;

  const handleSave = () => {
    if (isSaveDisabled) return;

    if (props.mode === 'edit') {
      props.onSubmit(changes);
      return;
    }
    props.onSubmit(form);
  };

  const handleClipboardGesture = () => {
    void readFromUserGesture();
  };

  const handleClipboardPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    parseText(event.clipboardData.getData('text'));
  };

  const handleApplyClipboard = () => {
    if (parsed) prefill(parsed);
    clear();
  };

  return (
    <>
      <div className='flex flex-col gap-16'>
        <Input
          label='예금주명'
          placeholder='예금주명'
          value={form.holderName}
          onPointerDown={handleClipboardGesture}
          onPaste={handleClipboardPaste}
          onChange={handleFieldChange('holderName')}
        />
        <Input
          label='계좌번호'
          inputMode='numeric'
          pattern='[0-9]*'
          helperText={accountNoHelperText}
          error={showAccountNoError}
          placeholder={accountNoPlaceholder}
          value={form.accountNo}
          onPointerDown={handleClipboardGesture}
          onPaste={handleClipboardPaste}
          onBlur={() => setIsAccountNoBlurred(true)}
          onChange={handleFieldChange('accountNo')}
        />
        <Select
          label='은행'
          placeholder='은행'
          options={bankOptions}
          value={form.bank}
          renderBottomSheet={(close) => (
            <BankSelectBottomSheet
              banks={banks}
              selectedBank={form.bank}
              onConfirm={(bank) => {
                setField('bank', bank);
                close();
              }}
              onClose={close}
            />
          )}
        />
      </div>

      <Button
        variant='secondary'
        theme='dark'
        size='large'
        className='mt-auto'
        onClick={handleSave}
        disabled={isSaveDisabled}
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
