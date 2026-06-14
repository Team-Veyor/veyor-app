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
      table: { defaultValue: { summary: 'primary' } },
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      table: { defaultValue: { summary: 'dark' } },
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
      table: { defaultValue: { summary: 'medium' } },
    },
    hasGlow: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    isLoading: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    theme: 'dark',
    size: 'large',
    hasGlow: true,
    isLoading: false,
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

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { isLoading: true },
};

/** variant × theme 6개 조합 한눈에 보기 */
export const VariantThemeMatrix: Story = {
  render: (args) => (
    <div className='grid grid-cols-[200px_200px] gap-12'>
      {(['primary', 'secondary', 'danger'] as const).flatMap((variant) =>
        (['dark', 'light'] as const).map((theme) => (
          <Button {...args} key={`${variant}-${theme}`} variant={variant} theme={theme}>
            {variant} / {theme}
          </Button>
        )),
      )}
    </div>
  ),
};

/** size 3단계 비교 */
export const Sizes: Story = {
  render: (args) => (
    <div className='flex flex-col gap-12'>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Button {...args} key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};
