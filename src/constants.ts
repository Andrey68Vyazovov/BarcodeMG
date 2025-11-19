import { BarcodeFormat } from '@zxing/library';

export const CONSTANTS = {
  VERSION: "2.0 react",
  BARCODE_LIMIT_FOR_CONFIRM: 2
} as const;

export const SCANNER_CONFIG = {
  // Какие штрих-коды искать (все, что реально используется в магазинах/складах)
  POSSIBLE_FORMATS: [
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.RSS_EXPANDED, //транзитные
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.ITF,
    BarcodeFormat.CODABAR,
    // QR_CODE и DATA_MATRIX — только если нужны, они сильно замедляют!
    // BarcodeFormat.QR_CODE,
    // BarcodeFormat.DATA_MATRIX,
  ] as BarcodeFormat[],

  // Настройки декодера
  HINTS: {
    TRY_HARDER: true,                    // стараться сильнее
    CHARACTER_SET: 'UTF-8',              // важно для русских текстов
    PURE_BARCODE: false,                 // если сканируешь только "чистые" коды
    ALLOWED_LENGTHS: [],           // пустой массив = разрешить ВСЕ длины (критично!)
    ASSUME_GS1: true,              // DataBar Expanded и многие Code 128 — это GS1!
  },

  // Область сканирования (ROI) — только центр экрана
  ROI: {
    enabled: true,
    marginPercent: 10, // от краёв отрезаем по 15% → сканируем центральные 70%
  },

  // Настройки камеры
  CAMERA: {
    facingMode: 'environment' as const,
    width: { ideal: 1280, min: 1024 },
    height: { ideal: 720, min: 576 },
    frameRate: { ideal: 30, max: 30 },
    aspectRatio: { ideal: 16 / 9 },
  },

  // Частота сканирования (fps)
  SCAN_FPS: 18, // 18 кадров в секунду — идеальный баланс скорости/нагрузки

  // Задержка после успешного сканирования (мс)
  SUCCESS_BLOCK_MS: 2500,

  // Звук
  BEEP_SOUND_PATH: '/sounds/beep.wav',
} as const;