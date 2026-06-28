import type { RewardStatus } from '@/app/home/types/types';
import CheckOutlinedCircleIcon from '@/assets/icons/CheckOutlinedCircleIcon';
import ProcessOutlinedIcon from '@/assets/icons/ProcessOutlinedIcon';
import Badge from '@/components/Badge/Badge';

interface RewardBadgeProps {
  rewardStatus: RewardStatus;
  expiresAt: string | null;
}

const formatPayoutDueAt = (expiresAt: string | null) => {
  const dueAt = expiresAt ? new Date(expiresAt) : null;
  const hasDueAt = dueAt !== null && !Number.isNaN(dueAt.getTime());
  const date = hasDueAt ? dueAt : new Date();
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${value('month')}.${value('day')} ${hasDueAt ? value('hour') : '10'}:${hasDueAt ? value('minute') : '00'}`;
};

const RewardBadge = ({ rewardStatus, expiresAt }: RewardBadgeProps) => {
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
      {formatPayoutDueAt(expiresAt)}까지 지급 예정
    </Badge>
  );
};

export default RewardBadge;
