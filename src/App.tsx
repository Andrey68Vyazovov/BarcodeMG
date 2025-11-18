import { useCallback, useState } from "react"

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
    
    // Автоматическое добавление при сканировании (как в оригинале)
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

  const isSendDisabled = !email || barcodes.length === 0

  return (
    <div className="page">
      <div className="main-form">
        <button type="button" className="button_reload" onClick={handleReload}>
          <img src="./images/refresh.svg" className="svg_img" />
        </button>
        
        <button type="button" className="button_toggle" onClick={toggleForm}>
          <img src="./images/sliders.svg" className="svg_toggle" />
        </button>

        <div className="mail">
          <form className="mail-form" autoComplete="on" onSubmit={handleSendEmail}>
            <div className="mail-form-block">
              <label htmlFor="student6" className="select">Укажите почту:</label>
              <input 
                type="email" 
                id="student6" 
                name="student6" 
                className={`select_1 ${!email ? 'error-email' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="popup__close"
              disabled={isSendDisabled}
            />
          </form>
        </div>

        <div className="title">
          <h3 className="title_h">
            {currentForm === 'form1' ? 'Проверка НТ' : 'ТТ без стикеров'}
          </h3>
        </div>

        {currentForm === 'form1' ? (
          <div className="form1">
            <form method="GET" className="form" onSubmit={handleManualSubmit}>
              <label>Отсканируйте ШК:</label>
              <div className="form__div_1">
                <button 
                  type="button"
                  className={`button popup__button-10 ${isManualInput ? 'manual-active' : ''}`}
                  onClick={toggleManualInput}
                />
                <input 
                  className="input_1" 
                  autoFocus 
                  placeholder={isManualInput ? "ручной ввод" : "сканер"}
                  value={barcodeInput}
                  onChange={(e) => handleBarcodeInput1(e.target.value)}
                />
                <button type="button" className="button popup__button-7" />
                <button 
                  type="submit"
                  className={`button popup__button-11 ${isManualInput ? 'manual-active' : ''}`} 
                />
              </div>
              <label className="counter">Отсканировано ШК: {barcodes.length}</label>
            </form>
          </div>
        ) : (
          <div className="form2">
            <form method="GET" className="form_2">
              <label>Введите номер ТТ:</label>
              <input 
                className="input_3" 
                autoFocus 
                value={storeNumber}
                onChange={(e) => setStoreNumber(e.target.value)}
              />
              <label>Отсканируйте ШК:</label>
              <input 
                className="input_2" 
                autoFocus 
                value={barcodeInput2}
                onChange={(e) => handleBarcodeInput2(e.target.value)}
              />
              <label className="counter_2">Отсканировано ШК: {barcodes.length}</label>
            </form>
          </div>
        )}

        <p className="version">v2.0 react</p>
      </div>
    </div>
  )
}