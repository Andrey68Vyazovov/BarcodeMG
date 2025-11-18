import { useState, useCallback } from 'react';

export type FormType = 'form1' | 'form2';

export const useForms = () => {
  const [currentForm, setCurrentForm] = useState<FormType>('form1');
  const [email, setEmail] = useState('');
  const [storeNumber, setStoreNumber] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeInput2, setBarcodeInput2] = useState('');

  const toggleForm = useCallback(() => {
    setCurrentForm(prev => prev === 'form1' ? 'form2' : 'form1');
  }, []);

  const toggleManualInput = useCallback(() => {
    setIsManualInput(prev => !prev);
  }, []);

  const clearFormData = useCallback(() => {
    setBarcodeInput('');
    setBarcodeInput2('');
    setStoreNumber('');
    setEmail('');
  }, []);

  const clearBarcodeInputs = useCallback(() => {
    setBarcodeInput('');
    setBarcodeInput2('');
  }, []);

  return {
    currentForm,
    email,
    storeNumber,
    isManualInput,
    barcodeInput,
    barcodeInput2,
    setCurrentForm,
    setEmail,
    setStoreNumber,
    setIsManualInput,
    setBarcodeInput,
    setBarcodeInput2,
    toggleForm,
    toggleManualInput,
    clearFormData,
    clearBarcodeInputs
  };
};