export const isValidBarcode = (barcode: string): boolean => {
  return barcode.length >= 7;
};

export const isValidEmail = (email: string): boolean => {
  return email.length > 0 && email.includes('@') && email.includes('.');
};

export const canSendEmail = (email: string, barcodesCount: number): boolean => {
  return isValidEmail(email) && barcodesCount > 0;
};