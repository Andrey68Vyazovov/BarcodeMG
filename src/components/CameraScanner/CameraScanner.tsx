import React, { useRef, useEffect, useState } from 'react';
import { BarcodeScanner } from '../../utils/barcodeScanner';
import styles from './CameraScanner.module.scss';

interface CameraScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onBarcodeScanned,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<BarcodeScanner>();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const scanIntervalRef = useRef<number>();

  useEffect(() => {
    scannerRef.current = new BarcodeScanner();
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError('');
      setIsScanning(true);

      if (videoRef.current && scannerRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        videoRef.current.srcObject = stream;
        
        // Ждем пока видео начнет воспроизводиться
        videoRef.current.onloadedmetadata = () => {
          startPeriodicScanning();
        };
      }
    } catch (err) {
      setCameraError('Не удалось запустить камеру. Проверьте разрешения.');
      console.error('Camera error:', err);
      setIsScanning(false);
    }
  };

  const startPeriodicScanning = () => {
    if (!videoRef.current || !scannerRef.current) return;

    // Очищаем предыдущий интервал
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(async () => {
      if (!isScanning || !videoRef.current) {
        clearInterval(scanIntervalRef.current);
        return;
      }

      try {
        // Проверяем что видео готово
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const results = await scannerRef.current!.scanFromVideo(videoRef.current);
          if (results.length > 0) {
            console.log('Камера: найден штрих-код:', results[0]);
            onBarcodeScanned(results[0]);
            // Можно добавить звук успеха здесь
          }
        }
      } catch (scanError) {
        // Игнорируем ошибки сканирования (код не найден)
      }
    }, 500); // Увеличили частоту сканирования до 2 раз в секунду
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const toggleCamera = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className={styles.cameraOverlay}>
      <div className={styles.cameraContainer}>
        <div className={styles.cameraHeader}>
          <h3>Сканирование камерой</h3>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Закрыть камеру"
          >
            ×
          </button>
        </div>

        <div className={styles.cameraPreview}>
          <video 
            ref={videoRef} 
            className={styles.videoElement}
            autoPlay
            playsInline
            muted
          />
          
          <div className={styles.scanOverlay}>
            <div className={styles.scanFrame}>
              <div className={`${styles.corner} ${styles.topLeft}`}></div>
              <div className={`${styles.corner} ${styles.topRight}`}></div>
              <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
              <div className={`${styles.corner} ${styles.bottomRight}`}></div>
            </div>
            <div className={styles.scanLine}></div>
          </div>
        </div>

        {cameraError && (
          <div className={styles.errorMessage}>
            {cameraError}
          </div>
        )}

        <div className={styles.cameraControls}>
          <button 
            className={`${styles.controlButton} ${isScanning ? styles.stop : styles.start}`}
            onClick={toggleCamera}
          >
            {isScanning ? 'Остановить' : 'Сканировать'}
          </button>
          
          <button 
            className={styles.controlButton}
            onClick={handleClose}
          >
            Готово
          </button>
        </div>

        <div className={styles.instructions}>
          <p>Наведите камеру на штрих-код</p>
          <p>Автоматическое распознавание</p>
        </div>
      </div>
    </div>
  );
};