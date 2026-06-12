'use client';

import { useRouter } from 'next/navigation';
import useAccountForm from '@/app/add-account/_hooks/useAccountForm';
import useBanks from '@/app/add-account/_hooks/useBanks';
import useCreateAccountMutation from '@/app/add-account/_hooks/useCreateAccountMutation';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';

const page = () => {
  const router = useRouter();

  const { data: banks = [] } = useBanks();
  const { mutate, isPending } = useCreateAccountMutation();

  const { form, setBank, handleHolderNameChange, handleAccountNoChange, isFormFilled } =
    useAccountForm();

  const bankOptions = banks.map((bank) => ({ value: bank, label: bank }));

  const handleSave = () => {
    if (!isFormFilled || isPending) return;

    mutate(form, {
      onSuccess: () => router.replace('/home'),
    });
  };

  return (
    <>
      <div className='flex flex-col gap-16'>
        <Input placeholder='예금주명' value={form.holderName} onChange={handleHolderNameChange} />
        <Input placeholder='계좌번호' value={form.accountNo} onChange={handleAccountNoChange} />
        <Select
          options={bankOptions}
          value={form.bank}
          onChange={setBank}
          placeholder='은행'
          title='은행 선택'
        />
      </div>
      <Button
        theme='dark'
        size='large'
        className='mt-auto'
        onClick={handleSave}
        disabled={!isFormFilled || isPending}
      >
        저장
      </Button>
    </>
  );
};

export default page;
