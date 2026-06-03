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
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'danger'],
      description: '버튼의 시각적 스타일',
      table: { defaultValue: { summary: 'primary' } },
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
    children: '버튼',
    variant: 'primary',
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

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
