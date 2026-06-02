import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const suit = localFont({
  src: [
    { path: '../../public/fonts/SUIT-Thin.woff2', weight: '100', style: 'normal' },
    { path: '../../public/fonts/SUIT-ExtraLight.woff2', weight: '200', style: 'normal' },
    { path: '../../public/fonts/SUIT-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/SUIT-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/SUIT-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/SUIT-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/SUIT-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/SUIT-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../../public/fonts/SUIT-Heavy.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-suit',
});

export const metadata: Metadata = {
  title: '백설기',
  description:
    '누구나 더 나은 의사결정을 위한 의견을 모으고, 모든 참여가 정당하게 보상받을 수 있는 생태계를 만듭니다.',
  applicationName: '백설기',
  appleWebApp: {
    capable: true,
    title: '백설기',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#111827',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className={`${suit.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col font-sans'>{children}</body>
    </html>
  );
}
