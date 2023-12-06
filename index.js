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
  var email = 'vyazovov_av@magnit.ru';
  var subject = 'transit-barcode';
  var emailBody = arrayBarcode;
  document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
}





