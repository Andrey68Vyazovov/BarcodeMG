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
          video: { facingMode: 'environment' } 
        });
        
        videoRef.current.srcObject = stream;
        startPeriodicScanning();
      }
    } catch (err) {
      setCameraError('Не удалось запустить камеру');
      setIsScanning(false);
    }
  };

  const startPeriodicScanning = () => {
    if (!videoRef.current || !scannerRef.current) return;

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = window.setInterval(async () => {
      if (!isScanning || !videoRef.current) return;

      try {
        const results = await scannerRef.current!.scanFromVideo(videoRef.current);
        if (results.length > 0) {
          onBarcodeScanned(results[0]);
        }
      } catch (error) {
        // Игнорируем ошибки сканирования
      }
    }, 300); // Оптимальная частота для мобильных
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

  return (
    <div className={styles.cameraOverlay}>
      <div className={styles.cameraContainer}>
        <div className={styles.cameraHeader}>
          <h3>Сканирование штрих-кода</h3>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        {/* Компактная область предпросмотра как в оригинале */}
        <div className={styles.cameraPreview}>
          <video 
            ref={videoRef} 
            className={styles.videoElement}
            autoPlay
            playsInline
            muted
          />
          <div className={styles.scanFrame}></div>
        </div>

        {cameraError && (
          <div className={styles.errorMessage}>
            {cameraError}
          </div>
        )}

        <div className={styles.cameraControls}>
          <button 
            className={styles.controlButton}
            onClick={handleClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};