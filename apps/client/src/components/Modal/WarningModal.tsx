'use client';

import Button from '@/components/Button';
import Modal, { type ModalProps } from '@/components/Modal/Modal';

interface WarningModalProps extends ModalProps {
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
}

const WarningModal = ({
  title,
  description,
  leftButtonText,
  rightButtonText,
  onLeftButtonClick,
  onRightButtonClick,
}: WarningModalProps) => {
  return (
    <Modal title={title} description={description}>
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
