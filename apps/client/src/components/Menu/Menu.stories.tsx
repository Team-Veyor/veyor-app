import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Menu from './Menu';

/**
 * 케밥(점 3개) 트리거로 열리는 팝오버 메뉴입니다.
 * 바깥 영역 클릭 또는 `ESC` 키로 닫히고, `Menu.Item` 클릭 시 자동으로 닫힙니다.
 * `open` / `onOpenChange`로 제어하거나, 생략해 내부 상태로 사용할 수 있습니다.
 */
const meta = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  // 팝오버가 잘리지 않도록 충분한 공간을 확보합니다.
  decorators: [
    (Story) => (
      <div className='flex min-h-[360px] w-[360px] items-start justify-center pt-24'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 케밥 아이콘 트리거로 열리는 기본 형태. 항목을 클릭하면 메뉴가 닫힙니다. */
export const Default: Story = {
  args: {
    align: 'right',
    children: (
      <>
        <Menu.Item>대표 계좌로 선택</Menu.Item>
        <Menu.Item>수정</Menu.Item>
        <Menu.Item className='text-red-500'>삭제</Menu.Item>
      </>
    ),
  },
};

/** 트리거 왼쪽 기준으로 팝오버를 정렬합니다. */
export const AlignLeft: Story = {
  args: {
    align: 'left',
    children: (
      <>
        <Menu.Item>대표 계좌로 선택</Menu.Item>
        <Menu.Item>수정</Menu.Item>
        <Menu.Item className='text-red-500'>삭제</Menu.Item>
      </>
    ),
  },
};

/** 일부 항목을 비활성화한 상태. 비활성 항목은 클릭이 무시됩니다. */
export const WithDisabledItem: Story = {
  args: {
    children: (
      <>
        <Menu.Item>대표 계좌로 선택</Menu.Item>
        <Menu.Item disabled>수정</Menu.Item>
        <Menu.Item className='text-red-500'>삭제</Menu.Item>
      </>
    ),
  },
};
