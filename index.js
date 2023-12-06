const inputButton = document.querySelector(".popup__close"); 
const inputForm = document.querySelector(".input_1"); 
const inputCounter = document.querySelector(".counter"); 
const arrayBarcode = [];
let counter_1=0;


inputForm.addEventListener('input', ()=>{
  setTimeout(() => { 
    if (inputForm.value.length >=7 ) {
      arrayBarcode.push(inputForm.value);
      inputForm.value='';
      counter_1++;
      inputCounter.textContent='Отсканировано ШК: '+counter_1;
      }
   }, 750);
}); 

inputButton.addEventListener('click', ()=>{
console.log(arrayBarcode);
sendEmail();
arrayBarcode.length=0;
counter_1=0;
inputCounter.textContent='Отсканировано ШК: '+counter_1;
}); 

function sendEmail() {
  const email = 'rao_rctm@tambovrc.magnit.ru';
  const subject = 'transit-barcode';
  const emailBody = arrayBarcode.join('<br/>');
  document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
}


