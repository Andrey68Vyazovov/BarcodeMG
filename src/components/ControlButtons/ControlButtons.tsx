import React, { useState } from 'react';
import { ControlButtonsProps } from '../../types';
import styles from './ControlButtons.module.scss';

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onReload,
  onToggleForm
}) => {
  const [isReloadRotating, setIsReloadRotating] = useState(false);
  const [isToggleRotating, setIsToggleRotating] = useState(false);

  const handleReload = () => {
    setIsReloadRotating(true);
    setTimeout(() => {
      setIsReloadRotating(false);
      onReload();
    }, 1200);
  };

  const handleToggle = () => {
    setIsToggleRotating(true);
    setTimeout(() => {
      setIsToggleRotating(false);
      onToggleForm();
    }, 1100);
  };

  return (
    <>
      <button 
        type="button" 
        className={styles.button_reload} 
        onClick={handleReload}
      >
        <img 
          src="./images/refresh.svg" 
          className={`${styles.svg_img} ${isReloadRotating ? styles.svg_img_rotate : ''}`} 
          alt="Reload" 
        />
      </button>
      
      <button 
        type="button" 
        className={styles.button_toggle} 
        onClick={handleToggle}
      >
        <img 
          src="./images/sliders.svg" 
          className={`${styles.svg_toggle} ${isToggleRotating ? styles.svg_toggle_rotate : ''}`} 
          alt="Toggle Form" 
        />
      </button>
    </>
  );
};