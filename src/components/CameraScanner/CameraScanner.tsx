// src/components/CameraScanner/CameraScanner.tsx
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { scanImageData } from '@undecaf/zbar-wasm';
import styles from './CameraScanner.module.scss';
import beepSound from '../../assets/sounds/beep.wav';
import { SCANNER_CONFIG } from '../../constants';

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
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  const [scanResult, setScanResult] = useState<{ format: string; text: string } | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  // Звук
  useEffect(() => {
    audioRef.current = new Audio(beepSound);
  }, []);

  const playBeep = () => {
    audioRef.current?.play().catch(() => {});
  };

  const processScan = useCallback(async (ctx: CanvasRenderingContext2D) => {
    if (isBlocked) return;
  
    try {
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  
      // ВОТ ЭТО — ГЛАВНОЕ ДЛЯ ДВУСТРОЧНОГО DATABAR EXPANDED STACKED
      const symbols = await scanImageData(imageData);
  
      if (symbols.length > 0) {
        // Берём первый (самый уверенный) символ
        const symbol = symbols[0];
        const code = symbol.decode();                    // ← Полная строка с AI: (01)...(21)...
        const format = symbol.typeName.toUpperCase();    // ← DATABAR_EXPANDED, CODE128 и т.д.
  
        console.log('УСПЕХ:', { format, code }); // ← Для дебага в консоли
  
        setScanResult({ format, text: code });
        setIsBlocked(true);
        playBeep();
        onBarcodeScanned(code);
  
        setTimeout(() => {
          setScanResult(null);
          setIsBlocked(false);
        }, SCANNER_CONFIG.SUCCESS_BLOCK_MS);
      }
    } catch (err) {
      // Ошибки игнорируем — это нормально (нет кода, плохое освещение и т.д.)
    }
  }, [isBlocked, onBarcodeScanned]);

  const tick = useCallback(() => {
    if (isBlocked || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ROI — обрезаем ImageData (ZBar работает с ImageData, так что обрезаем после drawImage)
    let scanCtx: CanvasRenderingContext2D = ctx;

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
          scanCtx = croppedCtx;
        }
      }
    }

    processScan(scanCtx);
  }, [processScan, isBlocked]);

  useEffect(() => {
    let mounted = true;

    const initScanner = async () => {
      try {
        // ZBar-wasm загружается автоматически при первом scanImageData
        const stream = await navigator.mediaDevices.getUserMedia({
          video: SCANNER_CONFIG.CAMERA,
        });
        streamRef.current = stream;

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();

          // Запуск с FPS
          intervalIdRef.current = setInterval(tick, 1000 / SCANNER_CONFIG.SCAN_FPS);
        }
      } catch (err: any) {
        if (mounted) alert(`Камера недоступна: ${err.message}`);
      }
    };

    initScanner();

    return () => {
      mounted = false;
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [tick]);

  const handleClose = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
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