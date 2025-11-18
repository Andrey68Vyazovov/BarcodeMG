import React from 'react';
import { BarcodeScannerProps } from '../../types';
import styles from './BarcodeScanner.module.scss';

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  barcodeInput,
  barcodesCount,
  isManualInput,
  onBarcodeChange,
  onManualSubmit,
  onToggleManualInput,
  onOpenCamera
}) => {
  return (
    <div className={styles.form1}>
      <form method="GET" className={styles.form} onSubmit={onManualSubmit}>
        <label>Отсканируйте ШК:</label>
        <div className={styles.form_div_1}>
          <button 
            type="button"
            className={`${styles.button} ${styles.popup__button_10} ${isManualInput ? styles.manualActive : ''}`}
            onClick={onToggleManualInput}
          />
          <input 
            className={styles.input_1} 
            autoFocus 
            placeholder={isManualInput ? "ручной ввод" : "сканер"}
            value={barcodeInput}
            onChange={(e) => onBarcodeChange(e.target.value)}
          />
          <button 
            type="button" 
            className={`${styles.button} ${styles.popup__button_7}`}
            onClick={onOpenCamera}
            disabled={isManualInput}
          />
          <button 
            type="submit"
            className={`${styles.button} ${styles.popup__button_11} ${isManualInput ? styles.manualActive : ''}`} 
          />
        </div>
        <label className={styles.counter}>Отсканировано ШК: {barcodesCount}</label>
      </form>
    </div>
  );
};