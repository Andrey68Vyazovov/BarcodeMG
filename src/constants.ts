export const CONSTANTS = {
  VERSION: "2.1 react+wasm+zbar",
  BARCODE_LIMIT_FOR_CONFIRM: 2
} as const;

export const SCANNER_CONFIG = {
  ROI: {
    enabled: true,
    marginPercent: 10,        // было 8 → ставим 10 (очень важно для двустрочного DataBar!)
  },

  CAMERA: {
    facingMode: 'environment' as const,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },

  SCAN_FPS: 15,               // было 20 → 15 (стабильнее для сложных кодов)
  SUCCESS_BLOCK_MS: 2500,
  BEEP_SOUND_PATH: '/sounds/beep.wav',
} as const;