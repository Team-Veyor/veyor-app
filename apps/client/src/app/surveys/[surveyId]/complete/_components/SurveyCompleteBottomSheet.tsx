import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';

interface SurveyCompleteBottomSheetProps {
  onHomeClick: () => void;
}

const CHECKER_SIZE = '16px';

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
        <div
          aria-hidden='true'
          className='h-[136px] rounded-t-28 bg-gray-50'
          style={{
            backgroundImage:
              'linear-gradient(45deg, var(--color-gray-100) 25%, transparent 25%), linear-gradient(-45deg, var(--color-gray-100) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-gray-100) 75%), linear-gradient(-45deg, transparent 75%, var(--color-gray-100) 75%)',
            backgroundPosition: `0 0, 0 ${CHECKER_SIZE}, ${CHECKER_SIZE} -${CHECKER_SIZE}, -${CHECKER_SIZE} 0`,
            backgroundSize: `${CHECKER_SIZE} ${CHECKER_SIZE}`,
          }}
        />
        <div className='flex flex-col gap-2 px-20 pt-20'>
          <h2 className='title-xsmall text-gray-950'>설문이 완료되었습니다</h2>
          <p className='subtext-medium text-gray-500'>
            리워드는 다음날 오전 10시 이전까지
            <br />
            입력된 계좌로 입금됩니다.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
};

export default SurveyCompleteBottomSheet;
