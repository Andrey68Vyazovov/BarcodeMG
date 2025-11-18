// utils/barcodeScanner.ts
import { BrowserMultiFormatReader, Result } from '@zxing/library';

export class BarcodeScanner {
  private reader: BrowserMultiFormatReader;

  constructor() {
    this.reader = new BrowserMultiFormatReader();
  }

  async scanFromImage(imageElement: HTMLImageElement): Promise<string[]> {
    try {
      const result: Result = await this.reader.decodeFromImageElement(imageElement);
      console.log('Найден штрих-код:', result.getText());
      return [result.getText()];
    } catch (error) {
      console.warn('ZXing: не удалось распознать штрих-код', error);
      return [];
    }
  }

  async scanFromVideo(videoElement: HTMLVideoElement): Promise<string[]> {
    try {
      const result: Result = await this.reader.decodeFromVideoElement(videoElement);
      console.log('Найден штрих-код:', result.getText());
      return [result.getText()];
    } catch (error) {
      // Это нормально - код может быть не найден
      console.log('ZXing: штрих-код не найден в кадре');
      return [];
    }
  }

  async scanFromCanvas(canvas: HTMLCanvasElement): Promise<string[]> {
    try {
      // Создаем временный image элемент из canvas
      const image = new Image();
      image.src = canvas.toDataURL();
      
      // Ждем загрузки изображения
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
      
      return await this.scanFromImage(image);
    } catch (error) {
      console.warn('ZXing: не удалось распознать штрих-код с canvas', error);
      return [];
    }
  }

  async scanFromFile(file: File): Promise<string[]> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = async () => {
        try {
          const results = await this.scanFromImage(img);
          resolve(results);
        } catch (error) {
          resolve([]);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve([]);
      };
      
      img.src = url;
    });
  }

  stopScanning(): void {
    this.reader.reset();
  }
}