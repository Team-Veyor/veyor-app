import List from '@/components/List/List';
import Skeleton from '@/components/Skeleton/Skeleton';

const SKELETON_ROWS = Array.from({ length: 5 }, (_, index) => index);

const ParticipationsSkeleton = () => {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='flex shrink-0 items-center justify-between bg-white px-24 py-24'>
        <Skeleton width='100%' height={18} />
      </div>

      <div className='h-8 shrink-0 bg-gray-100' />

      <div className='min-h-0 flex-1 overflow-y-auto pb-[92px]'>
        <List className='rounded-none px-16'>
          {SKELETON_ROWS.map((row) => (
            <List.Item key={row} className='justify-between py-12'>
              <List.Item.Content>
                <div className='flex w-full flex-col items-start gap-[6px]'>
                  <Skeleton width='70%' height={18} />
                  <Skeleton width='40%' height={18} />
                </div>
              </List.Item.Content>
              <List.Item.Trailing>
                <Skeleton width={60} height={18} />
              </List.Item.Trailing>
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ParticipationsSkeleton;
