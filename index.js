const inputButton = document.querySelector(".popup__close"); 
const inputForm = document.querySelector(".input_1"); 
const inputCounter = document.querySelector(".counter");
const rlButton = document.querySelector(".button_reload"); 
const selects = document.querySelector("select");
let arrayBarcode = [];
let emailBodyText='';
let subjectText='';
let counter_1=0;
let date = new Date();



inputForm.addEventListener('input', ()=>{
  setTimeout(() => { 
    if (inputForm.value.length >=7 ) {
      var date_2 = new Date(); 
      arrayBarcode.push(inputForm.value +'$' + date_2.getDate() + '.' + (date_2.getMonth()+1) + '.' + date_2.getFullYear() + ' ' + date_2.getHours() + ':' + date_2.getMinutes() + ':' + date_2.getSeconds());
      inputForm.value='';
      counter_1++;
      inputCounter.textContent='Отсканировано ШК: '+counter_1;
      }
   }, 750);
}); 

inputButton.addEventListener('click', () => {  
emailBodyText= arrayBarcode.join('%0D%0A');
subjectText='transit-barcode: ' + date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
console.log(emailBodyText);
counter_1=0;
inputCounter.textContent='Отсканировано ШК: '+counter_1;
sendEmail();
arrayBarcode.length=0;
}); 

rlButton.addEventListener('click', () => {  
  location.reload();
  }); 

function sendEmail() {
  const email = selects.value; //rao_rctm@tambovrc.magnit.ru
  const subject = subjectText;
  const emailBody = emailBodyText;
  document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
}


