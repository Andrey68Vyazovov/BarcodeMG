const inputButton = document.querySelector(".popup__close"); 
const inputForm = document.querySelector(".input_1"); 
const arrayBarcode = [];


inputForm.addEventListener('input', ()=>{
  setTimeout(() => { 
    if (inputForm.value.length >=7 ) {
      arrayBarcode.push(inputForm.value+'\n');
      inputForm.value='';
      }
   }, 500);
}); 

inputButton.addEventListener('click', ()=>{
console.log(arrayBarcode);
sendEmail();
}); 

function sendEmail() {
  const email = 'rao_rctm@tambovrc.magnit.ru';
  const subject = 'transit-barcode';
  const emailBody = arrayBarcode;
  document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
}





