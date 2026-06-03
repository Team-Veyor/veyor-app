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
  },
};

export default preview;
