import type { Participation } from '@/app/participations/_types/types';
import List from '@/components/List/List';
import { formatDate } from '@/lib/date';

interface ParticipationItemProps {
  participation: Participation;
}

const ParticipationItem = ({ participation }: ParticipationItemProps) => {
  const { surveyTitle, completedAt, rewardAmount } = participation;

  return (
    <List.Item className='justify-between py-20'>
      <List.Item.Content title={surveyTitle} subtext={formatDate(completedAt)} />
      <List.Item.Trailing>
        <p className='label-medium text-blue-500'>+{rewardAmount.toLocaleString()}원</p>
      </List.Item.Trailing>
    </List.Item>
  );
};

export default ParticipationItem;
