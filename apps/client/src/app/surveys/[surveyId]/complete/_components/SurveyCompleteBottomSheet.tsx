import CompleteIcon from '@/assets/icons/CompleteIcon';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';

interface SurveyCompleteBottomSheetProps {
  onHomeClick: () => void;
}

const SurveyCompleteBottomSheet = ({ onHomeClick }: SurveyCompleteBottomSheetProps) => {
  return (
    <BottomSheet
      className='overflow-hidden p-0'
      footer={
        <Button variant='secondary' size='large' onClick={onHomeClick}>
          홈으로 이동
        </Button>
      }
    >
      <div className='flex flex-col'>
        <div className='flex flex-col gap-2 px-20 pt-20 pb-32'>
          <h2 className='title-xsmall text-gray-950'>설문이 완료되었습니다</h2>
          <p className='subtext-medium text-gray-500'>
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
