import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '백설기',
    short_name: '백설기',
    description:
      '누구나 더 나은 의사결정을 위한 의견을 모으고, 모든 참여가 정당하게 보상받을 수 있는 생태계',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff', // TODO: 색상 변경
    theme_color: '#111827',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
