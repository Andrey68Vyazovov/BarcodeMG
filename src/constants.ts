import { BarcodeFormat, DecodeHintType } from '@zxing/library';

export const CONSTANTS = {
  VERSION: "2.0 react",
  BARCODE_LIMIT_FOR_CONFIRM: 2
} as const;

// === СКАНИРОВАНИЕ: частота и размеры ===
export const SCAN_FPS = 8;                            // 15 кадров/сек — идеально при воркерах
export const SCAN_INTERVAL_MS = Math.round(1000 / SCAN_FPS); // 66–67 мс
export const TARGET_VIDEO_WIDTH = 800;
export const TARGET_VIDEO_HEIGHT = 600;

// === ЗВУК ===
export const BEEP_VOLUME = 0.8;

// === ВОРКЕРЫ ===
export const MAX_WORKERS = Math.min(4, navigator.hardwareConcurrency || 3);

// === ВСЕ ФОРМАТЫ ZXing — от самых быстрых к самым медленным ===
// Это порядок имеет огромное значение: первые группы находят код за 50–100 мс, последние — до 1.5 сек
export const ALL_BARCODE_FORMATS_IN_ORDER: BarcodeFormat[] = [
  // 1D — мгновенно
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.ITF,
  BarcodeFormat.CODABAR,

  // RSS / DataBar — чуть медленнее
  BarcodeFormat.RSS_14,
  BarcodeFormat.RSS_EXPANDED,

  // 2D — тяжёлые (в порядке убывания скорости)
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.PDF_417,
  BarcodeFormat.AZTEC,
  BarcodeFormat.MAXICODE,
];

// === Группы для параллельного сканирования (4 воркера) ===
export const FORMAT_GROUPS: BarcodeFormat[][] = [
  ALL_BARCODE_FORMATS_IN_ORDER.slice(0, 5),   // EAN, UPC, CODE_128 — мгновенно
  ALL_BARCODE_FORMATS_IN_ORDER.slice(5, 9),   // CODE_39, ITF, CODABAR и т.д.
  ALL_BARCODE_FORMATS_IN_ORDER.slice(9, 12),  // RSS
  ALL_BARCODE_FORMATS_IN_ORDER.slice(12),     // QR, DataMatrix, PDF417, Aztec — самые тяжёлые
];

// === Подсказки для ZXing ===
export const ZXING_HINTS = (formats: BarcodeFormat[]) => {
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  hints.set(DecodeHintType.TRY_HARDER, true);
  return hints;
};

export const audioRef = { current: null as HTMLAudioElement | null };