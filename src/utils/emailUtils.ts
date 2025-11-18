import { BarcodeData } from '../hooks/useBarcodes';

export const generateEmailData = (
  barcodes: BarcodeData[], 
  currentForm: 'form1' | 'form2', 
  storeNumber: string
) => {
  const now = new Date();
  const dateStr = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  
  const subject = currentForm === 'form1' 
    ? `transit-barcode: ${dateStr}`
    : `barcode(${storeNumber}) : ${dateStr}`;
  
  const body = barcodes.map(b => b.code).join('%0D%0A');
  
  return { subject, body };
};

export const sendEmail = (email: string, subject: string, body: string) => {
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};