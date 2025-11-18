import { useState, useEffect } from 'react';

export const useCameraAvailability = () => {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        // Проверяем поддержку mediaDevices API
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          setHasCamera(false);
          setIsChecking(false);
          return;
        }

        // Получаем список устройств
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        // Проверяем есть ли камеры (не считая виртуальные с пустым label)
        const hasRealCamera = videoDevices.some(device => device.label !== '');
        
        setHasCamera(hasRealCamera && videoDevices.length > 0);
      } catch (error) {
        console.warn('Ошибка при проверке камеры:', error);
        setHasCamera(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkCamera();
  }, []);

  return { hasCamera, isChecking };
};