import React, { useRef, useEffect, useCallback, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import styles from './CameraScanner.module.scss';
import beepSound from '../../assets/sounds/beep.wav';
import { SCANNER_CONFIG } from '../../constants';
import { DecodeHintType } from '@zxing/library';

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
    audioRef.current?.play().catch(() => {});
  };

  const tick = useCallback(() => {
    if (isBlocked || !videoRef.current || !canvasRef.current || !readerRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    let sourceCanvas: HTMLCanvasElement = canvas;
  
    // Вручную обрезаем область (ROI)
    if (SCANNER_CONFIG.ROI.enabled) {
      const margin = SCANNER_CONFIG.ROI.marginPercent / 100;
      const x = Math.round(canvas.width * margin);
      const y = Math.round(canvas.height * margin);
      const width = Math.round(canvas.width * (1 - 2 * margin));
      const height = Math.round(canvas.height * (1 - 2 * margin));
  
      if (width > 0 && height > 0) {
        const cropped = document.createElement('canvas');
        cropped.width = width;
        cropped.height = height;
        const croppedCtx = cropped.getContext('2d');
        if (croppedCtx) {
          croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
          sourceCanvas = cropped;
        }
      }
    }
  
    try {
      const result = readerRef.current.decodeFromCanvas(sourceCanvas);
      if (result) {
        const format = result.getBarcodeFormat().toString().replace('FORMAT_', '').replace('_', '-');
        setScanResult({ format, text: result.getText() });
        setIsBlocked(true);
        playBeep();
        onBarcodeScanned(result.getText());
  
        setTimeout(() => {
          setScanResult(null);
          setIsBlocked(false);
        }, SCANNER_CONFIG.SUCCESS_BLOCK_MS);
      }
    } catch (err: any) {
      if (err.name !== 'NotFoundException') {
        console.warn('ZXing:', err);
      }
    }
  }, [isBlocked, onBarcodeScanned]);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, SCANNER_CONFIG.POSSIBLE_FORMATS);
    hints.set(DecodeHintType.TRY_HARDER, SCANNER_CONFIG.HINTS.TRY_HARDER);
    if (SCANNER_CONFIG.HINTS.CHARACTER_SET) {
      hints.set(DecodeHintType.CHARACTER_SET, SCANNER_CONFIG.HINTS.CHARACTER_SET);
    }

    reader.hints = hints;
    readerRef.current = reader;

    let intervalId: number | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: SCANNER_CONFIG.CAMERA,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();

          // Запускаем сканирование с нужной частотой
          intervalId = setInterval(() => {
            tick();
          }, 1000 / SCANNER_CONFIG.SCAN_FPS);
        }
      } catch (err: any) {
        alert(`Камера недоступна: ${err.message}`);
      }
    };

    startCamera();

    // Правильная очистка
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      readerRef.current = null;
    };
  }, [tick]);

  const handleClose = () => {
    // Останавливаем всё при закрытии по крестику
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    // Принудительно сбрасываем reader (на всякий случай)
    readerRef.current = null;
    onClose();
  };

  return (
    <div className={styles.cameraOverlay}>
      <div className={styles.cameraContainer}>
        <div className={styles.cameraHeader}>
          <h3>Наведите на штрих-код</h3>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        <div className={styles.cameraPreview}>
          <video ref={videoRef} className={styles.videoElement} playsInline muted autoPlay />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className={styles.scanFrame}>
            <div className={styles.cornerTopLeft}></div>
            <div className={styles.cornerTopRight}></div>
            <div className={styles.cornerBottomLeft}></div>
            <div className={styles.cornerBottomRight}></div>
          </div>

          <div className={`${styles.scanLine} ${isBlocked ? styles.paused : ''}`}></div>
        </div>

        {scanResult && (
          <div className={styles.resultOverlay}>
            <div className={styles.resultCard}>
              <div className={styles.resultIcon}>Checkmark</div>
              <div className={styles.resultFormat}>{scanResult.format}</div>
              <div className={styles.resultCode}>{scanResult.text}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};