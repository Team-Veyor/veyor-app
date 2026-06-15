import type { RewardStatus } from '@/app/home/types/types';
import CheckOutlinedCircleIcon from '@/assets/icons/CheckOutlinedCircleIcon';
import ProcessOutlinedIcon from '@/assets/icons/ProcessOutlinedIcon';
import Badge from '@/components/Badge/Badge';
import { formatDate } from '@/lib/date';

interface RewardBadgeProps {
  rewardStatus: RewardStatus;
}

const RewardBadge = ({ rewardStatus }: RewardBadgeProps) => {
  if (rewardStatus === 'paid') {
    return (
      <Badge type='success' leftAddon={<CheckOutlinedCircleIcon className='size-16' />}>
        지급 완료
      </Badge>
    );
  }

  return (
    <Badge
      type='warning'
      leftAddon={<ProcessOutlinedIcon />}
      className='border border-yellow-alpha-40 border-dashed'
    >
      {formatDate(new Date(), 'm. d.')} 10시까지 지급 예정
    </Badge>
  );
};

export default RewardBadge;
