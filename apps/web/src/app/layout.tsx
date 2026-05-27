import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veyor',
  description:
    '누구나 더 나은 의사결정을 위한 의견을 모으고, 모든 참여가 정당하게 보상받을 수 있는 생태계를 만듭니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className='h-full antialiased'>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  );
}
