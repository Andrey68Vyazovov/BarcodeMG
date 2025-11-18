// src/workers/barcodeWorker.ts
import { MultiFormatReader, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

const readerCache = new Map<string, MultiFormatReader>();

self.onmessage = (e: MessageEvent) => {
  const { buffer, width, height, formats, jobId } = e.data;

  // Сразу шлём подтверждение получения
  self.postMessage({
    type: 'debug',
    text: `Воркер получил кадр ${jobId} | ${width}×${height} | форматов: ${formats.length}`
  });

  // Создаём luminance source
  let luminanceSource;
  try {
    luminanceSource = new RGBLuminanceSource(new Uint8ClampedArray(buffer), width, height);
    self.postMessage({ type: 'debug', text: `LuminanceSource создан для jobId=${jobId}` });
  } catch (err: any) {
    self.postMessage({ type: 'debug', text: `ОШИБКА LuminanceSource: ${err.message}` });
    return;
  }

  const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

  const key = formats.join(',');
  let reader = readerCache.get(key);
  if (!reader) {
    reader = new MultiFormatReader();
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);
    reader.setHints(hints);
    readerCache.set(key, reader);
    self.postMessage({ type: 'debug', text: `Создан новый reader для ${formats.length} форматов` });
  }

  // Самый важный лог — перед декодированием
  self.postMessage({ type: 'debug', text: `Начинаю decode() для jobId=${jobId}...` });

  try {
    const result = reader.decode(binaryBitmap);
    
    // УСПЕХ!
    self.postMessage({
      success: true,
      text: result.getText(),
      format: result.getBarcodeFormat(),
      jobId,
    });

    self.postMessage({ type: 'debug', text: `УСПЕХ! Найден: ${result.getText()} (jobId=${jobId})` });

  } catch (err: any) {
    // Не нашли — нормально
    if (err.name === 'NotFoundException') {
      self.postMessage({ type: 'debug', text: `Не найдено в jobId=${jobId}` });
    } else {
      // Реальная ошибка
      self.postMessage({ 
        type: 'debug', 
        text: `ОШИБКА декодирования jobId=${jobId}: ${err.message}` 
      });
    }
    self.postMessage({ success: false, jobId });
  }
};