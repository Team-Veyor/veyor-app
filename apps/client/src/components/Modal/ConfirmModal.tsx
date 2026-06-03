import Button from '@/components/Button';
import Modal, { type ModalProps } from '@/components/Modal/Modal';

interface ConfirmModalProps extends ModalProps {
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
}

const ConfirmModal = ({
  title,
  description,
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
}: ConfirmModalProps) => {
  return (
    <Modal title={title} description={description}>
      <div className='flex gap-8'>
        <Button variant='secondary' size='large' onClick={onLeftButtonClick}>
          {leftButtonText}
        </Button>
        <Button variant='primary' size='large' onClick={onRightButtonClick}>
          {rightButtonText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
