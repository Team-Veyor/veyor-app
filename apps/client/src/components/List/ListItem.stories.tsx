import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChevronRightIcon from '@/assets/icons/ChevronRightIcon';
import List from './List';
import ListItem from './ListItem';

const meta = {
  title: 'Components/List/ListItem',
  component: ListItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '`List` 내부에 들어가는 한 행. 좌/중/우 슬롯을 sub-component로 조립합니다.',
          '',
          '- `onClick` 지정 시: 내부가 `<button>`으로 렌더링되며 cursor/hover가 적용됩니다.',
          '- `disabled`: `onClick`이 무시되고 행 전체가 흐려집니다.',
          '- `Trailing`에 토글 같은 버튼이 들어가는 경우 `onClick`을 비워야 합니다 (button-in-button 방지).',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '행 전체 클릭 시 호출됩니다. 지정하면 내부 컨테이너가 `<button>`이 됩니다.',
    },
    disabled: {
      control: 'boolean',
      description: '비활성 상태. `onClick`이 무시되고 시각적으로 흐려집니다.',
    },
    className: {
      control: false,
      description: '외부에서 주입할 Tailwind 클래스.',
    },
    children: {
      control: false,
      description: '`List.Item.Leading`, `List.Item.Content`, `List.Item.Trailing` 슬롯을 children으로 전달합니다.',
    },
  },
  decorators: [
    (Story) => (
      <div className='w-[360px] bg-gray-100 p-16'>
        <List>
          <Story />
        </List>
      </div>
    ),
  ],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls 패널에서 `onClick`/`disabled`를 토글하며 동작을 확인할 수 있습니다. */
export const Playground: Story = {
  args: {
    disabled: false,
  },
  render: (args) => (
    <ListItem {...args}>
      <List.Item.Content title='행 제목' subtext='보조 설명 텍스트' />
      <List.Item.Trailing>
        <ChevronRightIcon />
      </List.Item.Trailing>
    </ListItem>
  ),
};
