import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'radio',
      options: ['dark', 'brand', 'light', 'gray'],
      description: '버튼의 시각적 스타일',
      table: { defaultValue: { summary: 'dark' } },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      description: '버튼 크기',
      table: { defaultValue: { summary: 'medium' } },
    },
    children: {
      control: 'text',
      description: '버튼 내부에 렌더링되는 콘텐츠',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    theme: 'dark',
    size: 'large',
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className='w-[320px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {};

export const Brand: Story = {
  args: {
    theme: 'brand',
  },
};

export const Light: Story = {
  args: {
    theme: 'light',
  },
};

export const Gray: Story = {
  args: {
    theme: 'gray',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
