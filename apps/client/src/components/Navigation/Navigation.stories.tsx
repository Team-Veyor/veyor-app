import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Navigation from './Navigation';

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/home',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='relative min-h-[320px] w-[420px] bg-gray-50'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `/home` 진입 시 "홈" 아이템이 활성화된 상태. */
export const HomeActive: Story = {};

/** `/user` 진입 시 "내 정보" 아이템이 활성화된 상태. */
export const ProfileActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/user',
      },
    },
  },
};
