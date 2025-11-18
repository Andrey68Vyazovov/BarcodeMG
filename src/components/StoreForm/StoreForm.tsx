import React from 'react';
import { StoreFormProps } from '../../types';
import styles from './StoreForm.module.scss';

export const StoreForm: React.FC<StoreFormProps> = ({
  storeNumber,
  barcodeInput2,
  barcodesCount,
  onStoreNumberChange,
  onBarcodeChange
}) => {
  return (
    <div className={styles.form2}>
      <form method="GET" className={styles.form_2}>
        <label>Введите номер ТТ:</label>
        <input 
          className={styles.input_3} 
          autoFocus 
          value={storeNumber}
          onChange={(e) => onStoreNumberChange(e.target.value)}
        />
        <label>Отсканируйте ШК:</label>
        <input 
          className={styles.input_2} 
          autoFocus 
          value={barcodeInput2}
          onChange={(e) => onBarcodeChange(e.target.value)}
        />
        <label className={styles.counter_2}>Отсканировано ШК: {barcodesCount}</label>
      </form>
    </div>
  );
};