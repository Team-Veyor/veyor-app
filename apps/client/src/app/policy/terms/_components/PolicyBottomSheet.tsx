'use client';

import type { ReactNode } from 'react';
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import Button from '@/components/Button/Button';

interface PolicyBottomSheetProps {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

const PolicyBottomSheet = ({
  title,
  description,
  children,
  onClose,
  className,
}: PolicyBottomSheetProps) => {
  return (
    <BottomSheet
      className={className}
      scrollBody
      onClose={onClose}
      header={<h2 className='label-large pb-12 text-gray-900'>{title}</h2>}
      footer={
        <Button size='large' theme='dark' variant='secondary' onClick={onClose}>
          확인
        </Button>
      }
    >
      <div className='flex flex-col gap-12'>
        {description && (
          <p className='body-medium whitespace-pre-line text-gray-500'>{description}</p>
        )}
        <div className='body-medium whitespace-pre-line text-gray-600'>{children}</div>
      </div>
    </BottomSheet>
  );
};

export default PolicyBottomSheet;
