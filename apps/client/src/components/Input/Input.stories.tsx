import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ChangeEvent } from 'react';
import { useArgs } from 'storybook/preview-api';
import Input from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: '내용을 입력해 주세요',
    value: '',
  },
  decorators: [
    (Story) => (
      <div className='w-[320px]'>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<{ value?: string }>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      updateArgs({ value: event.target.value });
      args.onChange?.(event);
    };

    return <Input {...args} value={value ?? ''} onChange={handleChange} />;
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    helperText: 'Help text',
    placeholder: 'Placeholder',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Label',
    helperText: 'Help text',
    value: '입력된 값',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Label',
    helperText: 'Help text',
    placeholder: 'Placeholder',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화 상태',
  },
};
