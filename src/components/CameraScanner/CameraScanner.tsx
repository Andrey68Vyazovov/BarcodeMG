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
  const [scanAttempts, setScanAttempts] = useState<number>(0);
  const [lastScanTime, setLastScanTime] = useState<string>('');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const scanIntervalRef = useRef<number>();

  useEffect(() => {
    scannerRef.current = new BarcodeScanner();
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setDebugLog(prev => [...prev.slice(-10), logMessage]); // Храним только последние 10 записей
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      setIsScanning(true);
      setScanAttempts(0);
      setDebugLog([]);
      addDebugLog('Запуск камеры...');

      if (videoRef.current && scannerRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        videoRef.current.srcObject = stream;
        addDebugLog('Камера запущена успешно');
        
        // Ждем пока видео начнет воспроизводиться
        videoRef.current.onloadedmetadata = () => {
          addDebugLog('Видео готово к воспроизведению');
          startPeriodicScanning();
        };

        videoRef.current.onplay = () => {
          addDebugLog('Видео воспроизводится');
        };
      }
    } catch (err) {
      const errorMsg = 'Не удалось запустить камеру. Проверьте разрешения.';
      setCameraError(errorMsg);
      addDebugLog(`Ошибка камеры: ${err}`);
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

    addDebugLog('Начинаем сканирование...');

    scanIntervalRef.current = setInterval(async () => {
      if (!isScanning || !videoRef.current) {
        clearInterval(scanIntervalRef.current);
        return;
      }

      try {
        // Проверяем что видео готово
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          setScanAttempts(prev => prev + 1);
          const currentAttempt = scanAttempts + 1;
          addDebugLog(`Попытка сканирования #${currentAttempt}`);
          
          const results = await scannerRef.current!.scanFromVideo(videoRef.current);
          
          if (results.length > 0) {
            const barcode = results[0];
            const timestamp = new Date().toLocaleTimeString();
            console.log('Камера: найден штрих-код:', barcode);
            addDebugLog(`✅ УСПЕХ: найден штрих-код: ${barcode}`);
            setLastScanTime(timestamp);
            onBarcodeScanned(barcode);
            // Можно добавить звук успеха здесь
          } else {
            addDebugLog('❌ Штрих-код не найден в кадре');
          }
        } else {
          addDebugLog('⚠️ Видео не готово для сканирования');
        }
      } catch (scanError) {
        addDebugLog(`🚫 Ошибка сканирования: ${scanError}`);
        // Игнорируем ошибки сканирования (код не найден)
      }
    }, 500); // Сканируем каждые 500мс
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      addDebugLog('Сканирование остановлено');
    }
    
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      addDebugLog('Камера выключена');
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

  const clearDebugLog = () => {
    setDebugLog([]);
    setScanAttempts(0);
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

        {/* Отладочная информация */}
        <div className={styles.debugInfo}>
          <div className={styles.debugStats}>
            <span>Попыток: <strong>{scanAttempts}</strong></span>
            {lastScanTime && (
              <span>Последний: <strong>{lastScanTime}</strong></span>
            )}
            <span>Статус: <strong>{isScanning ? '🔍 Сканируем' : '⏸️ Остановлено'}</strong></span>
          </div>
          
          <div className={styles.debugLog}>
            <div className={styles.debugHeader}>
              <h4>Лог сканирования:</h4>
              <button 
                className={styles.clearLogButton}
                onClick={clearDebugLog}
                title="Очистить лог"
              >
                🗑️
              </button>
            </div>
            <div className={styles.logEntries}>
              {debugLog.map((entry, index) => (
                <div 
                  key={index} 
                  className={`${styles.logEntry} ${
                    entry.includes('✅') ? styles.success :
                    entry.includes('❌') ? styles.fail :
                    entry.includes('⚠️') ? styles.warning :
                    entry.includes('🚫') ? styles.error : ''
                  }`}
                >
                  {entry}
                </div>
              ))}
              {debugLog.length === 0 && (
                <div className={styles.noLogs}>Лог пуст. Начните сканирование...</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.cameraControls}>
          <button 
            className={`${styles.controlButton} ${isScanning ? styles.stop : styles.start}`}
            onClick={toggleCamera}
          >
            {isScanning ? '⏸️ Остановить' : '▶️ Сканировать'}
          </button>
          
          <button 
            className={styles.controlButton}
            onClick={handleClose}
          >
            ✅ Готово
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