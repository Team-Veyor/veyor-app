import { useRouter } from 'next/navigation';
import CompleteIcon from '@/assets/icons/CompleteIcon';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';

const SurveyCompleteBottomSheet = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.replace('/home');
  };

  return (
    <BottomSheet
      className='overflow-hidden'
      footer={
        <Button variant='secondary' size='large' onClick={handleHomeClick}>
          홈으로 이동
        </Button>
      }
    >
      <div className='flex flex-col'>
        <div className='flex flex-col gap-2'>
          <h2 className='title-xsmall text-gray-950'>설문이 완료되었습니다</h2>
          <p className='label-medium text-gray-500'>
            리워드는 다음날 오전 10시 이전까지
            <br />
            입력된 계좌로 입금됩니다.
          </p>
          <div className='flex items-center justify-center py-[47px]'>
            <CompleteIcon className='size-[86px]' />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default SurveyCompleteBottomSheet;
