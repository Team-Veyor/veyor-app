import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import RadioButton from '@/components/Radio/RadioButton';

const Info = () => {
  return (
    <div className='flex flex-col h-full pt-[24px] gap-[16px] px-[16px]'>
      <h1 className='title-medium pb-[8px]'>기본 정보를 입력해주세요</h1>
      <Input placeholder='출생연도' />

      <div className='flex w-full gap-[8px]'>
        <RadioButton label='남성' name='gender' value='male' variant='outlined' hasRightIcon />
        <RadioButton label='여성' name='gender' value='female' variant='outlined' hasRightIcon />
      </div>

      <Button theme='dark' size='large' className='mt-auto'>
        다음
      </Button>
    </div>
  );
};

export default Info;
