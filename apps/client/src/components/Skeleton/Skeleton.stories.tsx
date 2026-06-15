import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Skeleton from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    shape: 'rect',
    width: 200,
    height: 16,
  },
  argTypes: {
    shape: {
      control: 'radio',
      options: ['rect', 'circle'],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 텍스트 한 줄을 대체하는 기본 사각형 스켈레톤. */
export const Default: Story = {};

/** 아바타·아이콘 자리에 쓰는 원형 스켈레톤. */
export const Circle: Story = {
  args: { shape: 'circle', width: 28, height: 28 },
};

/** 여러 줄 텍스트 블록을 조합한 예시. */
export const TextBlock: Story = {
  render: () => (
    <div className='flex w-[280px] flex-col gap-8'>
      <Skeleton width='100%' height={16} />
      <Skeleton width='90%' height={16} />
      <Skeleton width='60%' height={16} />
    </div>
  ),
};

/** 카드 헤더 + 본문을 조합한 로딩 레이아웃 예시. */
export const Card: Story = {
  render: () => (
    <div className='flex w-[280px] flex-col gap-12 rounded-20 bg-white p-20'>
      <Skeleton width={120} height={20} />
      <div className='flex flex-col gap-8'>
        <Skeleton width='100%' height={14} />
        <Skeleton width='80%' height={14} />
      </div>
    </div>
  ),
};
