import React, { useState } from 'react';
import { ControlButtonsProps } from '../../types';
import styles from './ControlButtons.module.scss';

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onReload,
  onToggleForm
}) => {
  const [isReloadRotating, setIsReloadRotating] = useState(false);
  const [isToggleRotating, setIsToggleRotating] = useState(false);
  const [isReloadDisabled, setIsReloadDisabled] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);

  const handleReload = () => {
    if (isReloadDisabled) return; // Защита от повторного клика
    
    setIsReloadDisabled(true);
    setIsReloadRotating(true);
    
    setTimeout(() => {
      setIsReloadRotating(false);
      setIsReloadDisabled(false);
      onReload();
    }, 1200);
  };

  const handleToggle = () => {
    if (isToggleDisabled) return; // Защита от повторного клика
    
    setIsToggleDisabled(true);
    setIsToggleRotating(true);
    
    setTimeout(() => {
      setIsToggleRotating(false);
      setIsToggleDisabled(false);
      onToggleForm();
    }, 1100);
  };

  return (
    <>
      <button 
        type="button" 
        className={styles.button_reload} 
        onClick={handleReload}
        disabled={isReloadDisabled} // Блокируем на время анимации
      >
        <img 
          src="images/refresh.svg" 
          className={`${styles.svg_img} ${isReloadRotating ? styles.svg_img_rotate : ''}`} 
          alt="Reload" 
        />
      </button>
      
      <button 
        type="button" 
        className={styles.button_toggle} 
        onClick={handleToggle}
        disabled={isToggleDisabled} // Блокируем на время анимации
      >
        <img 
          src="images/sliders.svg" 
          className={`${styles.svg_toggle} ${isToggleRotating ? styles.svg_toggle_rotate : ''}`} 
          alt="Toggle Form" 
        />
      </button>
    </>
  );
};