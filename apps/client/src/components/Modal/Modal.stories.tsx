import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import ConfirmModal from './ConfirmModal';
import WarningModal from './WarningModal';

const handleClick = () => undefined;

const meta = {
  title: 'Components/Modal',
  component: ConfirmModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    title: '대표 계좌로 선택할까요?',
    description: '이후 리워드는 변경한 계좌로 지급됩니다.',
    leftButtonText: '아니요',
    rightButtonText: '예',
    onLeftButtonClick: handleClick,
    onRightButtonClick: handleClick,
  },
  decorators: [
    (Story) => (
      <div className='flex min-h-[360px] items-center justify-center bg-gray-100'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button size='large' className='w-[120px]' onClick={() => setOpen(true)}>
          모달 열기
        </Button>
        {open && (
          <ConfirmModal
            {...args}
            onLeftButtonClick={() => {
              args.onLeftButtonClick?.();
              close();
            }}
            onRightButtonClick={() => {
              args.onRightButtonClick?.();
              close();
            }}
          />
        )}
      </>
    );
  },
};

export const Warning: Story = {
  args: {
    title: '정말 탈퇴하시겠어요?',
    description: '탈퇴하면 계정 정보와 활동 내역이 삭제되며 복구할 수 없습니다.',
    leftButtonText: '취소',
    rightButtonText: '탈퇴하기',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    return (
      <>
        <Button
          variant='secondary'
          theme='dark'
          size='large'
          className='w-[120px]'
          onClick={() => setOpen(true)}
        >
          모달 열기
        </Button>
        {open && (
          <WarningModal
            {...args}
            onLeftButtonClick={() => {
              args.onLeftButtonClick?.();
              close();
            }}
            onRightButtonClick={() => {
              args.onRightButtonClick?.();
              close();
            }}
          />
        )}
      </>
    );
  },
};
