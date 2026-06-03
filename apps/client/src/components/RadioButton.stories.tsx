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
    label: {
      control: 'text',
      description: '라디오 버튼에 표시할 라벨',
    },
    variant: {
      control: 'radio',
      options: ['filled', 'outlined'],
      description: '라디오 버튼의 시각적 스타일',
      table: { defaultValue: { summary: 'filled' } },
    },
    hasLeftIcon: {
      control: 'boolean',
      description: '왼쪽 체크 아이콘 표시 여부',
    },
    hasRightIcon: {
      control: 'boolean',
      description: '오른쪽 체크 아이콘 표시 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    defaultChecked: {
      control: 'boolean',
      description: '초기 선택 상태 (비제어 모드)',
    },
    name: {
      control: 'text',
      description: '같은 name끼리 라디오 그룹으로 동작',
    },
    onChange: { action: 'changed' },
  },
  args: {
    label: '선택지',
    name: 'radio-story',
    variant: 'filled',
    hasLeftIcon: true,
    hasRightIcon: false,
    defaultChecked: true,
    disabled: false,
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
