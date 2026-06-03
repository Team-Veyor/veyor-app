'use client';

import Button from '@/components/Button/Button';
import Modal, { type ModalProps } from '@/components/Modal/Modal';

interface WarningModalProps extends ModalProps {
  /** 왼쪽(보조) 버튼에 표시할 텍스트. 보통 취소 액션입니다. */
  leftButtonText: string;
  /** 오른쪽(경고) 버튼에 표시할 텍스트. 탈퇴/삭제 등 경고 액션입니다. */
  rightButtonText: string;
  /** 왼쪽 버튼 클릭 시 실행되는 콜백 */
  onLeftButtonClick: () => void;
  /** 오른쪽 버튼 클릭 시 실행되는 콜백 (경고 액션) */
  onRightButtonClick: () => void;
}

/**
 * 경고(되돌릴 수 없는) 액션을 확인받는 경고 모달.
 * 우측 버튼은 danger 스타일로 표시되어 위험을 시각적으로 알립니다.
 */
const WarningModal = ({
  title,
  description,
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
  ...modalProps
}: WarningModalProps) => {
  return (
    <Modal title={title} description={description} {...modalProps}>
      <Button variant='secondary' size='large' onClick={onLeftButtonClick}>
        {leftButtonText}
      </Button>
      <Button variant='danger' size='large' onClick={onRightButtonClick}>
        {rightButtonText}
      </Button>
    </Modal>
  );
};

export default WarningModal;
