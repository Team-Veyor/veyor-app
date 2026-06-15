import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HomeIcon from '@/assets/icons/HomeIcon';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';

const ToastAnimationDemo = () => {
  const { showToast } = useToast();

  return (
    <div className='flex min-h-[120px] flex-col items-center justify-center gap-8'>
      <button
        type='button'
        className='rounded-8 bg-gray-900 px-12 py-8 label-small text-white'
        onClick={() => showToast({ type: 'success', message: 'Message' })}
      >
        Show Toast
      </button>
    </div>
  );
};

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    type: 'warning',
    message: 'Message',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 주의가 필요한 상태를 알리는 토스트입니다. */
export const Warning: Story = {
  args: { type: 'warning' },
};

/** 작업 성공이나 완료 상태를 알리는 토스트입니다. */
export const Success: Story = {
  args: { type: 'success' },
};

/** 오류나 위험 상태를 알리는 토스트입니다. */
export const Danger: Story = {
  args: { type: 'danger' },
};

/** 기본 상태 아이콘 대신 주입한 커스텀 아이콘을 표시합니다. */
export const CustomIcon: Story = {
  args: {
    type: 'success',
    message: 'Custom icon',
    icon: <HomeIcon className='size-24 text-icon-brand-weak' />,
  },
};

/** Show Toast 버튼을 누르면 전역 ToastProvider가 토스트를 띄운 뒤 자동으로 닫습니다. */
export const Animated: Story = {
  render: () => (
    <ToastProvider>
      <ToastAnimationDemo />
    </ToastProvider>
  ),
};
