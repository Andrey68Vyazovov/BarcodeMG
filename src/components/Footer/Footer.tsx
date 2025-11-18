import React from 'react';
import styles from './Footer.module.scss';

interface FooterProps {
  version: string;
}

export const Footer: React.FC<FooterProps> = ({ version }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <a 
          href="https://andrey68vyazovov.github.io/my-visit-card/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.copyright}
        >
          Andrey Vyazovov ©{currentYear}
        </a>
        <span className={styles.version}>v{version}</span>
      </div>
    </footer>
  );
};