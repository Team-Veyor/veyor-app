import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CheckOutlinedCircleIcon from '@/assets/icons/CheckOutlinedCircleIcon';
import Badge from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    type: 'default',
    children: 'Badge',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['default', 'brand', 'warning', 'success', 'danger'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 형태. 별도의 의미 없는 기본 라벨에 사용합니다. */
export const Default: Story = {};

/** 브랜드 컬러. 핵심 강조나 브랜드 액션과 연관된 상태에 사용합니다. */
export const Brand: Story = {
  args: { type: 'brand', children: 'Brand' },
};

/** 주의가 필요한 상태(미확정, 보류 등)에 사용합니다. */
export const Warning: Story = {
  args: { type: 'warning', children: 'Warning' },
};

/** 완료/확인 같은 긍정적인 상태에 사용합니다. */
export const Success: Story = {
  args: { type: 'success', children: 'Success' },
};

/** 오류·차단·삭제 등 위험을 알려야 하는 상태에 사용합니다. */
export const Danger: Story = {
  args: { type: 'danger', children: 'Danger' },
};

/**
 * 라벨 앞에 아이콘을 함께 표시하는 예시.
 * 아이콘 색상은 배지의 `text-*` 컬러를 자연스럽게 상속합니다.
 */
export const WithLeftAddon: Story = {
  args: {
    type: 'success',
    children: 'Completed',
    leftAddon: <CheckOutlinedCircleIcon className='size-16' />,
  },
};

/**
 * 라벨 뒤에 아이콘을 함께 표시하는 예시.
 * 아이콘 색상은 배지의 `text-*` 컬러를 자연스럽게 상속합니다.
 */
export const WithRightAddon: Story = {
  args: {
    type: 'success',
    children: 'Completed',
    rightAddon: <CheckOutlinedCircleIcon className='size-16' />,
  },
};
