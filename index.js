const form1 = document.querySelector(".form1");
const form2 = document.querySelector(".form2"); 

const inputButton = document.querySelector(".popup__close"); 
const inputForm = document.querySelector(".input_1"); 
const inputCounter = document.querySelector(".counter");
const rlButton = document.querySelector(".button_reload"); 
const tgButton = document.querySelector(".button_toggle");
const selects = document.querySelector(".select_1");

const inputButton_2 = document.querySelector(".popup__close_2"); 
const inputForm_2 = document.querySelector(".input_2"); 
const inputForm_3 = document.querySelector(".input_3"); 
const inputCounter_2 = document.querySelector(".counter_2");
const rlButton_2 = document.querySelector(".button_reload_2"); 
const tgButton_2 = document.querySelector(".button_toggle_2");
const selects_2 = document.querySelector(".select_2");
const title = document.querySelector(".title_h");

const popup = document.querySelector(".popup");
const popupButton = document.querySelector(".popup__button-5");
const message = document.querySelector(".message");
const popupClose = document.querySelector(".popup__close-5");

const img = document.querySelector(".svg_img");
const img_tg = document.querySelector(".svg_toggle");
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

inputForm_2.addEventListener('input', ()=>{
  setTimeout(() => { 
    if (inputForm_2.value.length >=7 ) {
      arrayBarcode.push(inputForm_2.value);
      inputForm_2.value='';
      counter_1++;
      inputCounter_2.textContent='Отсканировано ШК: '+counter_1;
      }
   }, 750);
}); 

inputButton.addEventListener('click', () => {  
emailBodyText= arrayBarcode.join('%0D%0A');
subjectText='transit-barcode: ' + date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
counter_1=0;
inputCounter.textContent='Отсканировано ШК: '+counter_1;
sendEmail();
arrayBarcode.length=0;
}); 

inputButton_2.addEventListener('click', () => {  
  emailBodyText= arrayBarcode.join('%0D%0A');
  subjectText='barcode('+ inputForm_3.value + ') : ' + date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  counter_1=0;
  inputCounter_2.textContent='Отсканировано ШК: '+counter_1;
  sendEmail();
  arrayBarcode.length=0;
  inputForm_3.value='';
  });

rlButton.addEventListener('click', () => {  
  setTimeout(() => { 
   img.classList.add('svg_img_rotate');  
  },300);
  setTimeout(() => { 
    img.classList.remove('svg_img_rotate'); 
  },1200);
  setTimeout(() => { 
    if (counter_1!==0) {
    popup.classList.add('popup__visible');
    message.textContent = "есть отсканированные ШК: " + counter_1;
    } else {
      location.reload();
    }
    //location.reload(); 
  },1600);
}); 

popupButton.addEventListener('click', () => {
  popup.classList.remove('popup__visible');
  location.reload();
});

popupClose.addEventListener('click', () => {
  popup.classList.remove('popup__visible');
});




tgButton.addEventListener('click', () => {  
  setTimeout(() => { 
    img_tg.classList.add('svg_toggle_rotate');  
  },200);  
  setTimeout(() => { 
    img_tg.classList.remove('svg_toggle_rotate'); 
  },1100);
  setTimeout(() => { 
    toggleForm(); 
  },1600);
  }); 

function sendEmail() {
  const email = selects.value; //rao_rctm@tambovrc.magnit.ru
  const subject = subjectText;
  const emailBody = emailBodyText;
  document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
}

function toggleForm() {
 if (form2.classList.contains('form_none')) {
form1.classList.add('form_none');
form2.classList.remove('form_none');
title.textContent="ТТ без стикеров";
 } else {
form1.classList.remove('form_none');
form2.classList.add('form_none');
title.textContent="Проверка НТ";
 }
} 


