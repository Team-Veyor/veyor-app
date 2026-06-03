import RadioButton from '@/components/Radio/RadioButton';
import RadioGroup from '@/components/Radio/RadioGroup';

export default function Home() {
  return (
    <main className='flex min-h-dvh items-center justify-center bg-[#B3B3B3] p-6'>
      <section className='flex flex-col gap-4'>
        <h1 className='label-large text-[#7D2BFF]'>❖ Control-Radio Button</h1>
        <div className='grid grid-cols-2 gap-x-16 rounded-[8px] border-2 border-dashed border-[#8D3DFF] p-10'>
          <RadioGroup name='outlined-radio-preview'>
            <RadioButton label='Label' value='right-icon' variant='outlined' hasRightIcon />
            <RadioButton
              label='Label'
              value='left-icon'
              variant='outlined'
              hasLeftIcon
              defaultChecked
            />
          </RadioGroup>
          <RadioGroup name='filled-radio-preview'>
            <RadioButton label='Label' value='right-icon' hasRightIcon />
            <RadioButton label='Label' value='left-icon' hasLeftIcon defaultChecked />
          </RadioGroup>
        </div>
      </section>
    </main>
  );
}
