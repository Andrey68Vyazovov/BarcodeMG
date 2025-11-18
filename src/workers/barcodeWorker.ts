// src/workers/barcodeWorker.ts
import { MultiFormatReader, DecodeHintType } from '@zxing/library';

const readerCache = new Map<string, MultiFormatReader>();

self.onmessage = async (e: MessageEvent) => {
  const { imageData, formats, jobId } = e.data;

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
    const result = reader.decode(imageData);
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