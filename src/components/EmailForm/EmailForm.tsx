import React from 'react';
import { EmailFormProps } from '../../types';
import styles from './EmailForm.module.scss';

export const EmailForm: React.FC<EmailFormProps> = ({
  email,
  isSendDisabled,
  onEmailChange,
  onSendEmail
}) => {
  return (
    <div className={styles.mail}>
      <form className={styles.mailForm} autoComplete="on" onSubmit={onSendEmail}>
        <div className={styles.mailForm_block}>
          <label htmlFor="student6" className={styles.select}>Укажите почту:</label>
          <input 
            type="email" 
            id="student6" 
            name="student6" 
            className={`${styles.select_1} ${!email ? styles.errorEmail : ''}`}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className={styles.popup__close}
          disabled={isSendDisabled}
        />
      </form>
    </div>
  );
};