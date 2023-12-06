const inputButton = document.querySelector(".popup__close"); 
const inputForm = document.querySelector(".input_1"); 
const inputCounter = document.querySelector(".counter"); 
let arrayBarcode = [];
let emailBodyText='';
let subjectText='';
let counter_1=0;
var date = new Date();


inputForm.addEventListener('input', ()=>{
  setTimeout(() => { 
    if (inputForm.value.length >=7 ) {
      arrayBarcode.push(inputForm.value);
    //arrayBarcode.push(String(inputForm.value + ' ' 
    //+ date.getDate() + '.' 
    //+ (date.getMonth()+1) 
    //+ '.' + date.getFullYear() 
    //+ ' ' + date.getHours() 
    //+ ':' + date.getMinutes() 
    //+ ':' + date.getSeconds()));
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

function sendEmail() {
  const email = 'vyazovov_av@magnit.ru'; //rao_rctm@tambovrc.magnit.ru
  const subject = subjectText;
  const emailBody = emailBodyText;
  document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
}


