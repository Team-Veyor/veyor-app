import type { Preview } from '@storybook/nextjs-vite';
import './preview.css';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['소개', 'Foundation', 'Components'],
      },
    },
    backgrounds: {
      // 그리드 오버레이가 작은 컴포넌트 미리보기를 방해해서 끔
      grid: { disable: true },
      options: {
        // gray-100 (앱 실제 배경)
        app: { name: 'App (gray-100)', value: '#f5f5f5' },
        light: { name: 'Light', value: '#ffffff' },
        dark: { name: 'Dark', value: '#1f2937' },
      },
    },
  },
};

export default preview;
