import { useState, useEffect } from 'react';

export const useCameraAvailability = () => {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        // Базовая проверка поддержки API
        if (!navigator.mediaDevices?.getUserMedia) {
          setHasCamera(false);
          setIsChecking(false);
          return;
        }

        // Способ 1: Быстрая проверка через getUserMedia (самый надежный)
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1, height: 1 } // Минимальные требования
          });
          
          // Камера доступна
          stream.getTracks().forEach(track => track.stop());
          setHasCamera(true);
        } catch (error: any) {
          // Анализируем ошибку
          if (error.name === 'NotFoundError' || 
              error.name === 'DevicesNotFoundError') {
            setHasCamera(false);
          } else if (error.name === 'NotAllowedError' || 
                     error.name === 'PermissionDismissedError') {
            // Пользователь не дал разрешение, но камера вероятно есть
            setHasCamera(true);
          } else if (error.name === 'NotSupportedError' ||
                     error.name === 'ConstraintNotSatisfiedError') {
            setHasCamera(false);
          } else {
            // Другие ошибки - предполагаем что камера есть
            setHasCamera(true);
          }
        }

        // Способ 2: Дополнительная проверка через enumerateDevices
        try {
          if (navigator.mediaDevices.enumerateDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            // В режиме инкогнито labels будут пустыми, но devices.length > 0
            const hasVideoInputs = videoDevices.length > 0;
            
            // Если getUserMedia сказал "нет", но устройства есть - доверяем устройствам
            if (hasVideoInputs && hasCamera === false) {
              setHasCamera(true);
            }
            
            // Если еще не определились (разрешение не дано), но устройства есть
            if (hasCamera === null && hasVideoInputs) {
              setHasCamera(true);
            }
          }
        } catch (enumerateError) {
          // Игнорируем ошибки enumerateDevices
          console.warn('enumerateDevices error:', enumerateError);
        }

        // Если все проверки не дали результата - предполагаем наличие камеры
        if (hasCamera === null) {
          setHasCamera(true);
        }

      } catch (error) {
        console.warn('Camera check error:', error);
        // В случае ошибки предполагаем что камера есть (лучше показать кнопку)
        setHasCamera(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkCamera();
  }, []);

  return { hasCamera, isChecking };
};