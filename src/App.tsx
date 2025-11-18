import { useCallback, useState } from "react"
import { ControlButtons } from "./components/ControlButtons"
import { EmailForm } from "./components/EmailForm"
import { Title } from "./components/Title"
import { BarcodeScanner } from "./components/BarcodeScanner"
import { StoreForm } from "./components/StoreForm"
import styles from './styles/styles.module.scss'

export function App() {
  const [currentForm, setCurrentForm] = useState<'form1' | 'form2'>('form1')
  const [barcodes, setBarcodes] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [storeNumber, setStoreNumber] = useState('')
  const [isManualInput, setIsManualInput] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState('')
  const [barcodeInput2, setBarcodeInput2] = useState('')

  const toggleForm = useCallback(() => {
    setCurrentForm(prev => prev === 'form1' ? 'form2' : 'form1')
    setBarcodes([])
    setBarcodeInput('')
    setBarcodeInput2('')
    setStoreNumber('')
  }, [])

  const toggleManualInput = useCallback(() => {
    setIsManualInput(prev => !prev)
  }, [])

  // Обработчик для формы 1
  const handleBarcodeInput1 = useCallback((value: string) => {
    setBarcodeInput(value)
    
    // Автоматическое добавление при сканировании
    if (!isManualInput && value.length >= 7) {
      const now = new Date()
      const timestamp = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      const barcodeData = `${value.split(' ')[0]}$${timestamp}`
      
      setBarcodes(prev => [...prev, barcodeData])
      setBarcodeInput('')
    }
  }, [isManualInput])

  // Обработчик для формы 2
  const handleBarcodeInput2 = useCallback((value: string) => {
    setBarcodeInput2(value)
    
    // Автоматическое добавление при сканировании
    if (value.length >= 7) {
      setBarcodes(prev => [...prev, value])
      setBarcodeInput2('')
    }
  }, [])

  // Обработчик ручного ввода (кнопка проверки)
  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (barcodeInput.length >= 7) {
      const now = new Date()
      const timestamp = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      const barcodeData = `${barcodeInput.split(' ')[0]}$${timestamp}`
      
      setBarcodes(prev => [...prev, barcodeData])
      setBarcodeInput('')
    }
  }, [barcodeInput])

  // Обработчик перезагрузки
  const handleReload = useCallback(() => {
    if (barcodes.length >= 5) {
      // Здесь будет логика попапа подтверждения
      console.log('Показываем попап подтверждения')
    } else {
      window.location.reload()
    }
  }, [barcodes.length])

  // Обработчик отправки email
  const handleSendEmail = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (email && barcodes.length > 0) {
      const now = new Date()
      const dateStr = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
      
      const subject = currentForm === 'form1' 
        ? `transit-barcode: ${dateStr}`
        : `barcode(${storeNumber}) : ${dateStr}`
      
      const body = barcodes.join('%0D%0A')
      
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      
      // Очищаем после отправки
      setBarcodes([])
      setEmail('')
      setStoreNumber('')
    }
  }, [email, barcodes, currentForm, storeNumber])

  const handleOpenCamera = useCallback(() => {
    // Здесь будет логика открытия камеры
    console.log('Открываем камеру')
  }, [])

  const isSendDisabled = !email || barcodes.length === 0

  return (
    <div className={styles.page}>
      <div className={styles.mainForm}>
        <ControlButtons 
          onReload={handleReload}
          onToggleForm={toggleForm}
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
            barcodesCount={barcodes.length}
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
            barcodesCount={barcodes.length}
            onStoreNumberChange={setStoreNumber}
            onBarcodeChange={handleBarcodeInput2}
          />
        )}

        <p className={styles.version}>v2.0 react</p>
      </div>
    </div>
  )
}