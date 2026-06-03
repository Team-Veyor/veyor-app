import Input from '@/components/Input';

export default function Home() {
  return (
    <main className='flex min-h-dvh items-center justify-center p-6'>
      <div className='flex flex-col gap-2'>
        <span className='label-large'>Input-Text Field</span>
        <Input aria-label='placeholder input' placeholder='placeholder' />
        <Input aria-label='focused input' autoFocus defaultValue='text' placeholder='focused' />
        <Input aria-label='default input' defaultValue='text' />
        <Input aria-label='disabled input' defaultValue='text' disabled />
      </div>
    </main>
  );
}
