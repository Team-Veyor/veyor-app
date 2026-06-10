import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon';
import Badge from '@/components/Badge/Badge';
import Toggle from '@/components/Toggle/Toggle';
import List from './List';

const meta = {
  title: 'Components/List',
  component: List,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '흰색 라운드 카드 안에 행(`List.Item`)들을 세로로 묶는 그룹 컨테이너입니다.',
          '',
          '### 구성',
          '- `List` — 카드 컨테이너. 자식 항목 사이에 자동 구분선이 들어갑니다.',
          '- `List.Item` — 한 행. `onClick`을 주면 내부가 `<button>`으로 렌더링됩니다.',
          '- `List.Item.Leading` — 행 좌측 슬롯 (아이콘/아바타).',
          '- `List.Item.Content` — 중앙 슬롯. `title`/`subtext` prop 또는 children으로 사용합니다.',
          '- `List.Item.Trailing` — 우측 슬롯. Badge·Toggle·텍스트·chevron 등을 자유롭게 조합합니다.',
          '',
          '### 주의',
          '- `List.Item`에 `onClick`을 주면 `<button>`이 되므로, `Trailing`에 또 다른 버튼/토글을 두면 button-in-button이 됩니다.',
          '  토글이 들어가는 행은 `onClick`을 비우고 토글 자체로만 인터랙션하세요.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: false,
      description:
        '외부에서 주입할 Tailwind 클래스. 카드의 padding/radius 등을 override할 수 있습니다.',
    },
    children: {
      control: false,
      description: '`List.Item` 들을 자식으로 전달합니다.',
    },
  },
  globals: {
    backgrounds: { value: 'app', grid: false },
  },
  decorators: [
    (Story) => (
      <div className='w-[360px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 가장 기본 형태. 제목 한 줄 + chevron. */
export const Single: Story = {
  render: () => (
    <List>
      <List.Item onClick={() => {}}>
        <List.Item.Content title='채팅 상담 바로가기' />
        <List.Item.Trailing>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
    </List>
  ),
};

/** 여러 항목이 한 그룹으로 묶인 리스트. 항목 사이에 구분선이 자동으로 들어갑니다. */
export const Multiple: Story = {
  render: () => (
    <List>
      <List.Item onClick={() => {}}>
        <List.Item.Content title='계좌 정보 관리' />
        <List.Item.Trailing>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
      <List.Item onClick={() => {}}>
        <List.Item.Content title='참여 내역' />
        <List.Item.Trailing>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
      <List.Item onClick={() => {}}>
        <List.Item.Content title='알림 설정' />
        <List.Item.Trailing>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
    </List>
  ),
};

/** 제목과 보조 텍스트가 함께 있는 행. */
export const WithSubtext: Story = {
  render: () => (
    <List>
      <List.Item onClick={() => {}}>
        <List.Item.Content title='고객센터' subtext='평일 10:00 - 18:00' />
        <List.Item.Trailing>
          <ChevronRightIcon className='size-24' />
        </List.Item.Trailing>
      </List.Item>
    </List>
  ),
};

/**
 * 행 좌측에 아이콘/아바타 등을 두는 예시.
 * `List.Item.Leading` 슬롯을 사용합니다.
 */
export const WithLeading: Story = {
  render: () => (
    <List>
      <List.Item onClick={() => {}}>
        <List.Item.Leading>
          <span
            aria-hidden
            className='flex h-32 w-32 items-center justify-center rounded-full bg-brand-50 text-brand-500'
          >
            🎁
          </span>
        </List.Item.Leading>
        <List.Item.Content title='이벤트' subtext='진행 중인 이벤트 보기' />
        <List.Item.Trailing>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
      <List.Item onClick={() => {}}>
        <List.Item.Leading>
          <span
            aria-hidden
            className='flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 text-gray-700'
          >
            👤
          </span>
        </List.Item.Leading>
        <List.Item.Content title='내 프로필' />
        <List.Item.Trailing>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
    </List>
  ),
};

/** `Trailing`에 Badge + chevron, 텍스트 + chevron 등 여러 요소를 자유롭게 조합. */
export const TrailingComposed: Story = {
  render: () => (
    <List>
      <List.Item onClick={() => {}}>
        <List.Item.Content title='이벤트 알림' subtext='새 이벤트가 도착했어요' />
        <List.Item.Trailing>
          <Badge type='brand'>NEW</Badge>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
      <List.Item onClick={() => {}}>
        <List.Item.Content title='결제 금액' />
        <List.Item.Trailing>
          <span className='label-small text-gray-900'>12,000원</span>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
    </List>
  ),
};

/**
 * `Trailing`에 토글을 두는 행.
 *
 * 이 경우 `List.Item`에는 `onClick`을 주지 마세요. 행 전체가 `<button>`이 되면
 * 내부 Toggle(`<button>`)과 중첩되어 button-in-button이 됩니다.
 */
export const WithToggle: Story = {
  render: () => {
    const [marketing, setMarketing] = useState(false);
    const [push, setPush] = useState(true);
    return (
      <List>
        <List.Item>
          <List.Item.Content title='마케팅 수신 동의' subtext='이벤트·혜택 알림을 받아요' />
          <List.Item.Trailing>
            <Toggle checked={marketing} onChange={setMarketing} aria-label='마케팅 수신 동의' />
          </List.Item.Trailing>
        </List.Item>
        <List.Item>
          <List.Item.Content title='푸시 알림' />
          <List.Item.Trailing>
            <Toggle checked={push} onChange={setPush} aria-label='푸시 알림' />
          </List.Item.Trailing>
        </List.Item>
      </List>
    );
  },
};

/** 비활성 행. 클릭이 막히고 시각적으로 흐려집니다. */
export const Disabled: Story = {
  render: () => (
    <List>
      <List.Item onClick={() => {}} disabled>
        <List.Item.Content title='준비 중인 기능' subtext='곧 만나요' />
        <List.Item.Trailing>
          <ChevronRightIcon />
        </List.Item.Trailing>
      </List.Item>
    </List>
  ),
};

/**
 * `onClick`이 없는 행. 단순 정보 표시용으로 사용하며 hover/cursor가 적용되지 않습니다.
 */
export const ReadOnly: Story = {
  render: () => (
    <List>
      <List.Item>
        <List.Item.Content title='버전' />
        <List.Item.Trailing>
          <span className='subtext-large text-gray-500'>v1.2.3</span>
        </List.Item.Trailing>
      </List.Item>
      <List.Item>
        <List.Item.Content title='이메일' />
        <List.Item.Trailing>
          <span className='subtext-large text-gray-500'>user@veyor.app</span>
        </List.Item.Trailing>
      </List.Item>
    </List>
  ),
};

/**
 * 실제 마이페이지처럼 여러 그룹을 쌓아 사용하는 예시.
 */
export const Grouped: Story = {
  render: () => (
    <div className='flex flex-col gap-16'>
      <List>
        <List.Item onClick={() => {}}>
          <List.Item.Content title='계좌 정보 관리' />
          <List.Item.Trailing>
            <ChevronRightIcon />
          </List.Item.Trailing>
        </List.Item>
        <List.Item onClick={() => {}}>
          <List.Item.Content title='참여 내역' />
          <List.Item.Trailing>
            <ChevronRightIcon />
          </List.Item.Trailing>
        </List.Item>
      </List>
      <List>
        <List.Item onClick={() => {}}>
          <List.Item.Content title='공지사항' />
          <List.Item.Trailing>
            <Badge type='brand'>N</Badge>
            <ChevronRightIcon />
          </List.Item.Trailing>
        </List.Item>
        <List.Item onClick={() => {}}>
          <List.Item.Content title='고객센터' subtext='평일 10:00 - 18:00' />
          <List.Item.Trailing>
            <ChevronRightIcon />
          </List.Item.Trailing>
        </List.Item>
      </List>
    </div>
  ),
};
