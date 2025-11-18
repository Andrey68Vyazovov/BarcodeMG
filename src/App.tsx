import { useCallback } from "react"
import { ControlButtons } from "./components/ControlButtons"
import { EmailForm } from "./components/EmailForm"
import { Title } from "./components/Title"
import { BarcodeScanner } from "./components/BarcodeScanner"
import { StoreForm } from "./components/StoreForm"
import styles from './styles/styles.module.scss'
import { Footer } from "./components/Footer"
import { PopupConfirm } from "./components/PopupConfirm"
import { CONSTANTS } from "./constants"
import { useBarcodes } from "./hooks/useBarcodes"
import { useConfirmPopup } from "./hooks/useConfirmPopup"
import { useForms } from "./hooks/useForms"
import { generateEmailData, sendEmail } from "./utils/emailUtils"
import { isValidBarcode, canSendEmail } from "./utils/validationUtils"

export function App() {
  const { barcodes, addBarcode, clearBarcodes, getBarcodesCount } = useBarcodes();
  const { 
    isConfirmOpen, 
    confirmMessage, 
    showConfirm, 
    hideConfirm, 
    executeConfirm, 
    shouldShowConfirm 
  } = useConfirmPopup();
  
  const {
    currentForm,
    email,
    storeNumber,
    isManualInput,
    barcodeInput,
    barcodeInput2,
    setEmail,
    setStoreNumber,
    setBarcodeInput,
    setBarcodeInput2,
    toggleForm,
    toggleManualInput,
    clearFormData,
    clearBarcodeInputs
  } = useForms();

  // Обработчик для формы 1
  const handleBarcodeInput1 = useCallback((value: string) => {
    setBarcodeInput(value);
    
    if (!isManualInput && isValidBarcode(value)) {
      addBarcode(value, true);
      setBarcodeInput('');
    }
  }, [isManualInput, addBarcode, setBarcodeInput]);

  // Обработчик для формы 2
  const handleBarcodeInput2 = useCallback((value: string) => {
    setBarcodeInput2(value);
    
    if (isValidBarcode(value)) {
      addBarcode(value, false);
      setBarcodeInput2('');
    }
  }, [addBarcode, setBarcodeInput2]);

  // Обработчик ручного ввода
  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isValidBarcode(barcodeInput)) {
      addBarcode(barcodeInput, true);
      setBarcodeInput('');
    }
  }, [barcodeInput, addBarcode, setBarcodeInput]);

  // Обработчик перезагрузки
  const handleReload = useCallback(() => {
    if (shouldShowConfirm(getBarcodesCount())) {
      showConfirm(`есть отсканированные ШК: ${getBarcodesCount()}`, () => {
        clearBarcodes();
        clearFormData();
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }, [shouldShowConfirm, getBarcodesCount, showConfirm, clearBarcodes, clearFormData]);

  // Обработчик переключения формы
  const handleToggleForm = useCallback(() => {
    if (shouldShowConfirm(getBarcodesCount())) {
      showConfirm(`есть отсканированные ШК: ${getBarcodesCount()}`, () => {
        toggleForm();
        clearBarcodes();
        clearBarcodeInputs();
        setStoreNumber('');
      });
    } else {
      toggleForm();
      clearBarcodes();
      clearBarcodeInputs();
      setStoreNumber('');
    }
  }, [shouldShowConfirm, getBarcodesCount, showConfirm, toggleForm, clearBarcodes, clearBarcodeInputs, setStoreNumber]);

  // Обработчик отправки email
  const handleSendEmail = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (canSendEmail(email, getBarcodesCount())) {
      const { subject, body } = generateEmailData(barcodes, currentForm, storeNumber);
      sendEmail(email, subject, body);
      
      clearBarcodes();
      setEmail('');
      setStoreNumber('');
    }
  }, [email, getBarcodesCount, barcodes, currentForm, storeNumber, clearBarcodes, setEmail, setStoreNumber]);

  const handleOpenCamera = useCallback(() => {
    console.log('Открываем камеру');
  }, []);

  const isSendDisabled = !canSendEmail(email, getBarcodesCount());

  return (
    <div className={styles.page}>
      <div className={styles.mainContainer}>
        <div className={styles.mainForm}>
          <ControlButtons 
            onReload={handleReload}
            onToggleForm={handleToggleForm}
          />

          <EmailForm 
            email={email}
            isSendDisabled={isSendDisabled}
            onEmailChange={setEmail}
            onSendEmail={handleSendEmail}
          />

          <Title currentForm={currentForm} />

          {currentForm === 'form1' ? (
            <BarcodeScanner 
              barcodeInput={barcodeInput}
              barcodesCount={getBarcodesCount()}
              isManualInput={isManualInput}
              onBarcodeChange={handleBarcodeInput1}
              onManualSubmit={handleManualSubmit}
              onToggleManualInput={toggleManualInput}
              onOpenCamera={handleOpenCamera}
            />
          ) : (
            <StoreForm 
              storeNumber={storeNumber}
              barcodeInput2={barcodeInput2}
              barcodesCount={getBarcodesCount()}
              onStoreNumberChange={setStoreNumber}
              onBarcodeChange={handleBarcodeInput2}
            />
          )}
        </div>
        
        <Footer version={CONSTANTS.VERSION} />
      </div>

      <PopupConfirm 
        isOpen={isConfirmOpen}
        message={confirmMessage}
        onConfirm={executeConfirm}
        onClose={hideConfirm}
      />
    </div>
  )
}