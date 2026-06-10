import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect, useState } from 'react';
import Toggle from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '켜짐/꺼짐 상태를 표현하는 스위치 컴포넌트입니다.',
          '',
          '- 내부적으로 `<button role="switch" aria-checked>` 로 렌더링되어 행/카드 등 외부 클릭 영역과 충돌 없이 사용할 수 있습니다.',
          '- 연결할 라벨이 필요하면 부모에서 `aria-label` 또는 `aria-labelledby`를 전달하세요.',
          '- `checked`를 주면 controlled, 생략하면 `defaultChecked`로 시작하는 uncontrolled로 동작합니다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '켜짐/꺼짐 상태 (제어 모드). 생략하면 내부 상태로 동작합니다.',
    },
    defaultChecked: {
      control: 'boolean',
      description: '비제어 모드의 초기값. 첫 렌더에만 적용됩니다.',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태. 클릭이 무시되고 시각적으로 흐려집니다.',
    },
    onChange: {
      action: 'changed',
      description: '상태가 바뀔 때 호출됩니다. 새 상태(boolean)가 인자로 전달됩니다.',
    },
    'aria-label': {
      control: 'text',
      description: '스크린리더용 라벨. 시각적 라벨이 없을 때 반드시 지정하세요.',
    },
    className: {
      control: false,
      description: '외부에서 주입할 Tailwind 클래스. 최종 override 지점입니다.',
    },
  },
  args: {
    'aria-label': '토글',
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls 패널의 `checked`를 조작해 동작을 확인할 수 있습니다.
 * 토글 자체를 클릭해도 상태가 변경되며 controls와 동기화됩니다.
 */
export const Playground: Story = {
  args: {
    checked: false,
  },
  render: (args) => {
    const [on, setOn] = useState(Boolean(args.checked));
    // controls에서 checked를 변경하면 스토리에도 반영
    useEffect(() => {
      setOn(Boolean(args.checked));
    }, [args.checked]);

    return (
      <Toggle
        {...args}
        checked={on}
        onChange={(next) => {
          setOn(next);
          args.onChange?.(next);
        }}
      />
    );
  },
};

/** 꺼짐 상태. */
export const Off: Story = {
  args: {
    checked: false,
  },
};

/** 켜짐 상태. */
export const On: Story = {
  args: {
    checked: true,
  },
};

/** 비활성. 클릭해도 변하지 않습니다. */
export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
