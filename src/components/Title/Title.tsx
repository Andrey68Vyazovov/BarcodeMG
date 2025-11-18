import React from 'react';
import { TitleProps } from '../../types';
import styles from './Title.module.scss';

export const Title: React.FC<TitleProps> = ({ currentForm }) => {
  const title = currentForm === 'form1' ? 'Проверка НТ' : 'ТТ без стикеров';
  
  return (
    <div className={styles.title}>
      <h3 className={styles.title_h}>{title}</h3>
    </div>
  );
};