import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RadioButton from './RadioButton';

const meta = {
  title: 'Components/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['filled', 'outlined'],
    },
  },
  args: {
    label: '선택지',
    name: 'radio-story',
    variant: 'filled',
    hasLeftIcon: true,
    hasRightIcon: false,
    defaultChecked: true,
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const WithRightIcon: Story = {
  args: {
    hasLeftIcon: false,
    hasRightIcon: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Group: Story = {
  render: () => (
    <div className='flex gap-3'>
      <RadioButton label='찬성' name='poll' value='agree' defaultChecked hasLeftIcon />
      <RadioButton label='반대' name='poll' value='disagree' hasLeftIcon />
    </div>
  ),
};
