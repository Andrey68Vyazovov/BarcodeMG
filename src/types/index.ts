export interface AppState {
  currentForm: 'form1' | 'form2';
  barcodes: string[];
  email: string;
  storeNumber: string;
  isManualInput: boolean;
  barcodeInput: string;
  barcodeInput2: string;
}

export interface EmailFormProps {
  email: string;
  isSendDisabled: boolean;
  onEmailChange: (email: string) => void;
  onSendEmail: (e: React.FormEvent) => void;
}

export interface BarcodeScannerProps {
  barcodeInput: string;
  barcodesCount: number;
  isManualInput: boolean;
  onBarcodeChange: (value: string) => void;
  onManualSubmit: (e: React.FormEvent) => void;
  onToggleManualInput: () => void;
  onOpenCamera: () => void;
}

export interface StoreFormProps {
  storeNumber: string;
  barcodeInput2: string;
  barcodesCount: number;
  onStoreNumberChange: (value: string) => void;
  onBarcodeChange: (value: string) => void;
}

export interface ControlButtonsProps {
  onReload: () => void;
  onToggleForm: () => void;
}

export interface TitleProps {
  currentForm: 'form1' | 'form2';
}