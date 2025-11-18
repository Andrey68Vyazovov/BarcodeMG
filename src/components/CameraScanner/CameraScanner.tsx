// src/components/CameraScanner/CameraScanner.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import styles from './CameraScanner.module.scss';

interface CameraScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onBarcodeScanned,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const requestRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const tick = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !readerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const result = readerRef.current.decodeFromCanvas(canvas);
        if (result) {
          onBarcodeScanned(result.getText());
          onClose(); // автоматически закрываем после успеха
          return;
        }
      } catch (err: any) {
        // NotFoundException — это нормально, просто нет штрихкода в кадре
        if (err.name !== 'NotFoundException') {
          console.warn('ZXing ошибка:', err);
        }
      }
    }

    requestRef.current = requestAnimationFrame(tick);
  }, [onBarcodeScanned, onClose]);

  useEffect(() => {
    const startScanning = async () => {
      try {
        readerRef.current = new BrowserMultiFormatReader();

        // Ускоряем распознавание (опционально, но очень помогает)
        const hints = new Map();
        hints.set(5 /* DecodeHintType.TRY_HARDER */, true);
        hints.set(1 /* DecodeHintType.POSSIBLE_FORMATS */, [
          // Добавь только нужные форматы — быстрее
          'EAN_13', 'EAN_8', 'CODE_128', 'CODE_39', 'QR_CODE', 'DATA_MATRIX'
        ]);
        readerRef.current.hints = hints;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();

          // Запускаем цикл сканирования после первого кадра
          requestRef.current = requestAnimationFrame(tick);
        }
      } catch (err: any) {
        console.error('Ошибка доступа к камере:', err);
        alert(`Не удалось открыть камеру: ${err.message || err}`);
      }
    };

    startScanning();

    // Очистка при размонтировании
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      // В новых версиях reset() нет → просто пересоздаём reader
      readerRef.current = null;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [tick]);

  const handleClose = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    readerRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    onClose();
  };

  return (
    <div className={styles.cameraOverlay} onClick={handleClose}>
      <div className={styles.cameraContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.cameraHeader}>
          <h3>Наведите на штрих-код</h3>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        <div className={styles.cameraPreview}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            playsInline
            muted
            autoPlay
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className={styles.scanFrame}>
            <div className={styles.cornerTopLeft}></div>
            <div className={styles.cornerTopRight}></div>
            <div className={styles.cornerBottomLeft}></div>
            <div className={styles.cornerBottomRight}></div>
          </div>
        </div>

        <div className={styles.cameraControls}>
          <button className={styles.controlButton} onClick={handleClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};