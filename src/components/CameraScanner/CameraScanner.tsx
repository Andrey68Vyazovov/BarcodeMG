// src/components/CameraScanner/CameraScanner.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './CameraScanner.module.scss';
import beepSound from '../../assets/sounds/beep.wav';
import {
  SCAN_INTERVAL_MS,
  TARGET_VIDEO_WIDTH,
  TARGET_VIDEO_HEIGHT,
  MAX_WORKERS,
  FORMAT_GROUPS,
  BEEP_VOLUME,
  audioRef,
} from '../../constants';

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
  const workersRef = useRef<Worker[]>([]);
  const jobIdRef = useRef(0);
  const activeJobRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [scanResult, setScanResult] = useState<{ format: string; text: string } | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  // Звук — теперь правильно
  useEffect(() => {
    const audio = new Audio(beepSound);
    audio.volume = BEEP_VOLUME;
    audioRef.current = audio;
  }, []);

  const playBeep = () => {
    audioRef.current?.play().catch(() => {});
  };

  // Инициализация воркеров
  useEffect(() => {
    for (let i = 0; i < MAX_WORKERS; i++) {
      const worker = new Worker(new URL('../../workers/barcodeWorker.ts', import.meta.url), {
        type: 'module',
      });
      workersRef.current.push(worker);
    }

    return () => {
      workersRef.current.forEach(w => w.terminate());
      workersRef.current = [];
    };
  }, []);

  const captureAndDispatch = useCallback(() => {
    if (isBlocked || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = TARGET_VIDEO_WIDTH;
    canvas.height = TARGET_VIDEO_HEIGHT;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const jobId = ++jobIdRef.current;
    activeJobRef.current = jobId;

    let resolved = false;

    FORMAT_GROUPS.forEach((formats, index) => {
      if (resolved || activeJobRef.current !== jobId) return;

      const worker = workersRef.current[index];
      if (!worker) return;

      const handler = (e: MessageEvent) => {
        if (e.data.jobId !== jobId || resolved) {
          worker.removeEventListener('message', handler);
          return;
        }

        if (e.data.success) {
          resolved = true;
          activeJobRef.current = null;
          worker.removeEventListener('message', handler);

          const formatName = e.data.format.toString().replace('FORMAT_', '').replace('_', '-');

          setScanResult({ format: formatName, text: e.data.text });
          playBeep();
          onBarcodeScanned(e.data.text);
          setIsBlocked(true);

          setTimeout(() => {
            setScanResult(null);
            setIsBlocked(false);
          }, 2500);
        }
      };

      worker.addEventListener('message', handler);
      console.log('Отправляем кадр в воркеры, jobId:', jobId);
      worker.postMessage(
        {
          buffer: imageData.data.buffer,
          width: canvas.width,
          height: canvas.height,
          formats,
          jobId,
        },
        [imageData.data.buffer]
      );
    });
  }, [isBlocked, onBarcodeScanned]);

  // Правильный запуск камеры и сканирования
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: TARGET_VIDEO_WIDTH },
            height: { ideal: TARGET_VIDEO_HEIGHT },
          },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();

          // Запускаем интервал
          intervalRef.current = window.setInterval(captureAndDispatch, SCAN_INTERVAL_MS);
        }
      } catch (err: any) {
        alert(`Камера недоступна: ${err.message || err}`);
      }
    };

    startCamera();

    // Очистка
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [captureAndDispatch]);

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    workersRef.current.forEach(w => w.terminate());
    streamRef.current?.getTracks().forEach(t => t.stop());
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