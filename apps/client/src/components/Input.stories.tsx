import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Input from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    placeholder: '내용을 입력해 주세요',
  },
  decorators: [
    (Story) => (
      <div className='w-[320px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: '입력된 값',
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화 상태',
  },
};
