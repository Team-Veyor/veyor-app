export interface OpenSourceLicense {
  name: string;
  license: string;
  href: string;
}

export const OPEN_SOURCE_LICENSES: OpenSourceLicense[] = [
  {
    name: 'Next.js',
    license: 'MIT License',
    href: 'https://github.com/vercel/next.js',
  },
  {
    name: 'React',
    license: 'MIT License',
    href: 'https://github.com/facebook/react',
  },
  {
    name: 'React DOM',
    license: 'MIT License',
    href: 'https://github.com/facebook/react',
  },
  {
    name: 'TanStack Query',
    license: 'MIT License',
    href: 'https://github.com/TanStack/query',
  },
  {
    name: 'supabase-js',
    license: 'MIT License',
    href: 'https://github.com/supabase/supabase-js',
  },
  {
    name: 'ky',
    license: 'MIT License',
    href: 'https://github.com/sindresorhus/ky',
  },
  {
    name: 'Motion',
    license: 'MIT License',
    href: 'https://github.com/motiondivision/motion',
  },
  {
    name: 'Tailwind CSS',
    license: 'MIT License',
    href: 'https://github.com/tailwindlabs/tailwindcss',
  },
  {
    name: 'clsx',
    license: 'MIT License',
    href: 'https://github.com/lukeed/clsx',
  },
  {
    name: 'tailwind-merge',
    license: 'MIT License',
    href: 'https://github.com/dcastil/tailwind-merge',
  },
];
