import React, { useRef, useEffect, useCallback, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import styles from './CameraScanner.module.scss';
import beepSound from '@/public/sounds/beep.wav';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Состояние результата
  const [scanResult, setScanResult] = useState<{ format: string; text: string } | null>(null);
  const [isBlocked, setIsBlocked] = useState(false); // блокировка сканирования

  // Звук
  useEffect(() => {
    audioRef.current = new Audio(beepSound);
  }, []);

  const playBeep = () => {
    audioRef.current?.play().catch(() => {
      // iOS может блокировать автозвук без взаимодействия — игнорируем
    });
  };

  const tick = useCallback(() => {
    if (isBlocked || !videoRef.current || !canvasRef.current || !readerRef.current) return;

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
          const format = result.getBarcodeFormat().toString().replace('FORMAT_', '').replace('_', '-');
          const text = result.getText();

          // Показываем результат
          setScanResult({ format, text });
          setIsBlocked(true);
          playBeep();

          // Передаём наверх (в App)
          onBarcodeScanned(text);

          // Автоматически скрываем через 2.5 сек и разблокируем
          setTimeout(() => {
            setScanResult(null);
            setIsBlocked(false);
          }, 2500);
        }
      } catch (err: any) {
        if (err.name !== 'NotFoundException') {
          console.warn('ZXing ошибка:', err);
        }
      }
    }

    requestRef.current = requestAnimationFrame(tick);
  }, [onBarcodeScanned, isBlocked]);

  useEffect(() => {
    const startScanning = async () => {
      try {
        readerRef.current = new BrowserMultiFormatReader();
        const hints = new Map();
        hints.set(5, true); // TRY_HARDER
        hints.set(1, ['EAN_13', 'EAN_8', 'CODE_128', 'CODE_39', 'QR_CODE']);
        readerRef.current.hints = hints;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 } },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          requestRef.current = requestAnimationFrame(tick);
        }
      } catch (err: any) {
        alert(`Камера недоступна: ${err.message || err}`);
      }
    };

    startScanning();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      readerRef.current = null;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [tick]);

  const handleClose = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    readerRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    onClose();
  };

  return (
    <div className={styles.cameraOverlay}>
      <div className={styles.cameraContainer}>
        {/* Заголовок */}
        <div className={styles.cameraHeader}>
          <h3>Наведите на штрих-код</h3>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        {/* Видео + рамка */}
        <div className={styles.cameraPreview}>
          <video ref={videoRef} className={styles.videoElement} playsInline muted autoPlay />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className={styles.scanFrame}>
            <div className={styles.cornerTopLeft}></div>
            <div className={styles.cornerTopRight}></div>
            <div className={styles.cornerBottomLeft}></div>
            <div className={styles.cornerBottomRight}></div>
          </div>

          {/* Анимация "сканирующая линия" (по желанию) */}
          <div className={`${styles.scanLine} ${isBlocked ? styles.paused : ''}`}></div>
        </div>

        {/* Попап с результатом */}
        {scanResult && (
          <div className={styles.resultOverlay}>
            <div className={styles.resultCard}>
              <div className={styles.resultIcon}>✓</div>
              <div className={styles.resultFormat}>{scanResult.format}</div>
              <div className={styles.resultCode}>{scanResult.text}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};