import { useState, useCallback } from 'react';

export interface BarcodeData {
  code: string;
  timestamp: string;
}

export const useBarcodes = () => {
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);

  const addBarcode = useCallback((barcode: string, isForm1: boolean = true) => {
    const now = new Date();
    const timestamp = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    const barcodeData: BarcodeData = {
      code: isForm1 ? `${barcode.split(' ')[0]}$${timestamp}` : barcode,
      timestamp
    };

    setBarcodes(prev => [...prev, barcodeData]);
  }, []);

  const clearBarcodes = useCallback(() => {
    setBarcodes([]);
  }, []);

  const getBarcodesCount = useCallback(() => barcodes.length, [barcodes.length]);

  return {
    barcodes,
    addBarcode,
    clearBarcodes,
    getBarcodesCount
  };
};