import React from 'react';
import styles from './PopupConfirm.module.scss';

interface PopupConfirmProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const PopupConfirm: React.FC<PopupConfirmProps> = ({
  isOpen,
  message,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className={`${styles.popup} ${isOpen ? styles.popup__visible : ''}`}>
      <div className={styles.popup__content}>
        <button
          type="button"
          className={styles.popup__close_5}
          onClick={onClose}
        />
        <h3 className={styles.popup__title}>Вы уверены?</h3>
        <p className={styles.message}>{message}</p>
        <button 
          className={styles.button} 
          onClick={onConfirm}
        >
          Да
        </button>
      </div>
    </div>
  );
};