import Button from '@/components/Button/Button';
import Modal, { type ModalProps } from '@/components/Modal/Modal';

interface ConfirmModalProps extends ModalProps {
  /** 왼쪽(보조) 버튼에 표시할 텍스트. 보통 취소/거절 액션입니다. */
  leftButtonText: string;
  /** 오른쪽(주요) 버튼에 표시할 텍스트. 보통 확인/동의 액션입니다. */
  rightButtonText: string;
  /** 왼쪽 버튼 클릭 시 실행되는 콜백 */
  onLeftButtonClick: () => void;
  /** 오른쪽 버튼 클릭 시 실행되는 콜백 */
  onRightButtonClick: () => void;
}

/**
 * 사용자에게 확인을 요청하는 모달.
 * 좌측은 보조(secondary) 버튼, 우측은 주요(primary) 버튼으로 구성됩니다.
 */
const ConfirmModal = ({
  title,
  description,
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
  ...modalProps
}: ConfirmModalProps) => {
  return (
    <Modal title={title} description={description} {...modalProps}>
      <Button variant='secondary' size='large' onClick={onLeftButtonClick}>
        {leftButtonText}
      </Button>
      <Button variant='primary' size='large' onClick={onRightButtonClick}>
        {rightButtonText}
      </Button>
    </Modal>
  );
};

export default ConfirmModal;
