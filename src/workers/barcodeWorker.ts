// src/workers/barcodeWorker.ts
import { MultiFormatReader, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

const readerCache = new Map<string, MultiFormatReader>();

self.onmessage = (e: MessageEvent) => {
  console.log('Воркер получил кадр!', e.data.jobId, 'форматов:', e.data.formats.length);
  const { buffer, width, height, formats, jobId } = e.data;

  // Создаём LuminanceSource напрямую из буфера — без canvas вообще!
  const luminanceSource = new RGBLuminanceSource(
    new Uint8ClampedArray(buffer),
    width,
    height
  );

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
  }

  try {
    const result = reader.decode(binaryBitmap);
    self.postMessage({
      success: true,
      text: result.getText(),
      format: result.getBarcodeFormat(),
      jobId,
    });
  } catch (err) {
    self.postMessage({ success: false, jobId });
  }
};