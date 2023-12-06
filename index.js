const inputButton = document.querySelector(".popup__close"); 
const inputForm = document.querySelector(".input_1"); 
const inputCounter = document.querySelector(".counter"); 
const arrayBarcode = [];
const emailBodyText='';
const subjectText='';
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
emailBodyText= arrayBarcode;
subjectText='transit-barcode:';
console.log(subjectText);
console.log(arrayBarcode);
counter_1=0;
inputCounter.textContent='Отсканировано ШК: '+counter_1;
sendEmail();
arrayBarcode.length=0;
}); 

function sendEmail() {
  const email = 'vyazovov_av@magnit.ru'; //rao_rctm@tambovrc.magnit.ru
  const subject = subjectText;
  const emailBody = emailBodyText;
  document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
}


