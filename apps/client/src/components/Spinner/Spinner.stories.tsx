import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Spinner from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 24,
  },
  argTypes: {
    size: { control: { type: 'number' } },
    label: { control: { type: 'text' } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 스피너. size 컨트롤로 지름을 조절할 수 있습니다. */
export const Default: Story = {};

/** 전체 화면 대기 화면 예시. */
export const FullScreen: Story = {
  render: () => (
    <div className='flex min-h-[240px] w-[320px] items-center justify-center bg-gray-50'>
      <Spinner size={32} />
    </div>
  ),
};
