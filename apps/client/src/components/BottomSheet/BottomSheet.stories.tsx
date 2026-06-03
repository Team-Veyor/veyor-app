import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import AgreementBottomSheet from './AgreementBottomSheet';

const handleSubmit = (_ids: string[]) => undefined;

const meta = {
  title: 'Components/BottomSheet',
  component: AgreementBottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    label: 'Label',
    buttonText: 'Button',
    items: [
      { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
      { id: 'service', label: '백설기 서비스 이용 약관 동의', required: true },
      { id: 'marketing', label: '마케팅 수신 동의', required: false },
    ],
    onSubmit: handleSubmit,
  },
  decorators: [
    (Story) => (
      <div className='flex min-h-[640px] items-end justify-center bg-gray-100'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgreementBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Agreement: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant='primary' size='large' className='w-[160px]' onClick={() => setOpen(true)}>
          시트 열기
        </Button>
        {open && (
          <AgreementBottomSheet
            {...args}
            onSubmit={(ids) => {
              args.onSubmit(ids);
              setOpen(false);
            }}
          />
        )}
      </>
    );
  },
};
