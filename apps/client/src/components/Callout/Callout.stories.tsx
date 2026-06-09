import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Callout from './Callout';

const meta = {
  title: 'Components/Callout',
  component: Callout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['default', 'brand', 'warning', 'success', 'danger'],
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'radio',
      options: ['small', 'large'],
      table: { defaultValue: { summary: 'large' } },
    },
    title: { control: 'text' },
    subTexts: { control: 'object' },
  },
  args: {
    type: 'default',
    size: 'large',
    title: 'Title',
    subTexts: ['Subtext 1', 'Subtext 2', 'Subtext 3', 'Subtext 4'],
  },
  decorators: [
    (Story) => (
      <div className='w-[360px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
  args: { type: 'brand' },
};

export const Warning: Story = {
  args: { type: 'warning' },
};

export const Success: Story = {
  args: { type: 'success' },
};

export const Danger: Story = {
  args: { type: 'danger' },
};

export const Small: Story = {
  args: { size: 'small' },
};

export const Large: Story = {
  args: { size: 'large' },
};

export const WithoutSubTexts: Story = {
  args: {
    subTexts: undefined,
  },
};
