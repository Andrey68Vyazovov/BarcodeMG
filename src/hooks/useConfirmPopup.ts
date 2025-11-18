import { useState, useCallback } from 'react';
import { CONSTANTS } from '../constants';

export const useConfirmPopup = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const showConfirm = useCallback((message: string, action: () => void) => {
    setConfirmMessage(message);
    setPendingAction(() => action);
    setIsConfirmOpen(true);
  }, []);

  const hideConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setPendingAction(null);
  }, []);

  const executeConfirm = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    hideConfirm();
  }, [pendingAction, hideConfirm]);

  const shouldShowConfirm = useCallback((barcodesCount: number) => {
    return barcodesCount >= CONSTANTS.BARCODE_LIMIT_FOR_CONFIRM;
  }, []);

  return {
    isConfirmOpen,
    confirmMessage,
    showConfirm,
    hideConfirm,
    executeConfirm,
    shouldShowConfirm
  };
};