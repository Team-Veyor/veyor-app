import List from '@/components/List/List';
import Skeleton from '@/components/Skeleton/Skeleton';

const SKELETON_ROWS = Array.from({ length: 2 }, (_, index) => index);

const AccountSkeleton = () => {
  return (
    <>
      {SKELETON_ROWS.map((row) => (
        <List key={row}>
          <List.Item>
            <List.Item.Leading>
              <Skeleton shape='circle' width={32} height={32} />
            </List.Item.Leading>
            <List.Item.Content>
              <div className='flex w-full flex-col items-start gap-[2px]'>
                <Skeleton width='40%' height={18} />
                <Skeleton width='55%' height={18} />
              </div>
            </List.Item.Content>
            <List.Item.Trailing>
              <Skeleton width={56} height={18} className='rounded-max' />
              <Skeleton width={24} height={24} />
            </List.Item.Trailing>
          </List.Item>
        </List>
      ))}
    </>
  );
};

export default AccountSkeleton;
