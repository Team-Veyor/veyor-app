'use client';

import EmptyList from '@/app/user/participations/_components/EmptyList';
import ParticipationItem from '@/app/user/participations/_components/ParticipationItem';
import ParticipationsSkeleton from '@/app/user/participations/_components/ParticipationsSkeleton';
import useParticipations from '@/app/user/participations/_hooks/useParticipations';
// import useParticipations from '@/app/participations/_hooks/useParticipations';
import CashIcon from '@/assets/icons/CashIcon';
import List from '@/components/List/List';

const ParticipationsPage = () => {
  // TODO: API 연결 (더미 데이터 사용 중)
  const { data, isPending, isError } = useParticipations();

  if (isPending) {
    return <ParticipationsSkeleton />;
  }

  if (isError || !data) {
    // TODO: 에러 처리
    return <p className='px-16 py-20 label-medium text-gray-500'>참여 내역을 불러오지 못했어요.</p>;
  }

  const { totalAmount, items } = data;

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='flex shrink-0 items-center justify-between bg-white px-24 py-24'>
        <div className='flex items-center gap-4 '>
          <CashIcon />
          <p className='label-medium text-gray-500'>내가 모은 돈</p>
        </div>
        <p className='label-medium text-gray-600'>{totalAmount.toLocaleString()}원</p>
      </div>

      <div className='h-8 shrink-0 bg-gray-100' />

      <div className='scrollbar-custom min-h-0 flex-1 overflow-y-auto pb-[92px]'>
        {items.length === 0 ? (
          <EmptyList />
        ) : (
          <List className='rounded-none px-16'>
            {items.map((participation) => (
              <ParticipationItem key={participation.id} participation={participation} />
            ))}
          </List>
        )}
      </div>
    </div>
  );
};

export default ParticipationsPage;
