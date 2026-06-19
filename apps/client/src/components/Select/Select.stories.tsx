import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useArgs } from 'storybook/preview-api';
import Select from './Select';

const BANK_OPTIONS = [
  { value: 'kb', label: 'KB국민은행' },
  { value: 'shinhan', label: '신한은행' },
  { value: 'woori', label: '우리은행' },
  { value: 'hana', label: '하나은행' },
  { value: 'toss', label: '토스뱅크' },
  { value: 'kakao', label: '카카오뱅크' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
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
    options: BANK_OPTIONS,
    placeholder: '은행',
    title: '은행 선택',
    value: '',
  },
  decorators: [
    (Story) => (
      <div className='w-[360px]'>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<{ value?: string }>();
    return (
      <Select
        {...args}
        value={value ?? ''}
        onChange={(next) => {
          updateArgs({ value: next });
          args.onChange?.(next);
        }}
      />
    );
  },
} satisfies Meta<typeof Select>;

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
    value: 'shinhan',
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
  },
};
