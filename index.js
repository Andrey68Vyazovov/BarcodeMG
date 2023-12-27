const form1 = document.querySelector(".form1");
const form2 = document.querySelector(".form2"); 
const form3 = document.querySelector(".form"); 

const inputButton = document.querySelector(".popup__close"); 
const inputForm = document.querySelector(".input_1"); 
const inputCounter = document.querySelector(".counter");
const rlButton = document.querySelector(".button_reload"); 
const tgButton = document.querySelector(".button_toggle");
const selects = document.querySelector(".select_1");

const inputForm_2 = document.querySelector(".input_2"); 
const inputForm_3 = document.querySelector(".input_3"); 
const inputCounter_2 = document.querySelector(".counter_2");
const rlButton_2 = document.querySelector(".button_reload_2"); 
const tgButton_2 = document.querySelector(".button_toggle_2");
const selects_2 = document.querySelector(".select_2");
const title = document.querySelector(".title_h");

const popup = document.querySelector(".popup");
const popup_2 = document.querySelector(".popup_type_photo");
const popupButton = document.querySelector(".popup__button-5");
const barcodeButton = document.querySelector(".popup__button-7");
const barcode2Button = document.querySelector(".popup__button-8");
const message = document.querySelector(".message");
const popupClose = document.querySelector(".popup__close-5");

const img = document.querySelector(".svg_img");
const img_tg = document.querySelector(".svg_toggle");
let arrayBarcode = [];
let emailBodyText='';
let subjectText='';
let counter_1=0;
let date = new Date();
let technical = '';

//камера



form3.addEventListener('submit', (evt)=>{
  evt.preventDefault();
  popup_2.classList.add('popup__visible');
});


// делаем кнопки отправить неактивными *******************************************
inputButton.setAttribute('disabled', 'true');

// *******************************************************************************
const validation = () => {
  if (selects.value==="") {
    selects.classList.add('error-email');
  } else {
    selects.classList.remove('error-email'); 
    if (arrayBarcode.length>0) inputButton.removeAttribute("disabled");
  }
}

validation();

selects.addEventListener('input', () => {
  validation();
});


// заполнение массива ШК по изменению полей ***************************************
inputForm.addEventListener('input', ()=>{
  setTimeout(() => { 
    if (inputForm.value.length >=7 ) {
      var date_2 = new Date(); 
      arrayBarcode.push(inputForm.value.split(' ')[0] +'$' + date_2.getDate() + '.' + (date_2.getMonth()+1) + '.' + date_2.getFullYear() + ' ' + date_2.getHours() + ':' + date_2.getMinutes() + ':' + date_2.getSeconds());
      inputForm.value='';
      counter_1++;
      inputCounter.textContent='Отсканировано ШК: '+counter_1;
      if (selects.value!=='') inputButton.removeAttribute("disabled");
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
      if (selects.value!=='') inputButton.removeAttribute("disabled");
      }
   }, 750);
}); 
// ********************************************************************************

// кнопки отправки форм mail ******************************************************
inputButton.addEventListener('click', () => {  
emailBodyText= arrayBarcode.join('%0D%0A');
if (title.textContent==="Проверка НТ") {
  subjectText='transit-barcode: ' + date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
} else {
  subjectText='barcode('+ inputForm_3.value + ') : ' + date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
};
counter_1=0;
inputCounter.textContent='Отсканировано ШК: '+counter_1;
inputCounter_2.textContent='Отсканировано ШК: '+counter_1;
sendEmail();
arrayBarcode.length=0;
inputForm.value='';
inputForm_2.value='';
inputForm_3.value='';
inputButton.setAttribute('disabled', 'true');
}); 

// *******************************************************************************

// переключение форм *************************************************************
function toggleForm() {
  if (form2.classList.contains('form_none')) {
    counter_1=0;
    arrayBarcode.length=0;
    inputCounter.textContent='Отсканировано ШК: '+counter_1;
    inputCounter_2.textContent='Отсканировано ШК: '+counter_1;
    inputForm_3.value='';
    inputForm_2.value='';
    inputForm.value='';
    inputButton.setAttribute('disabled', '');
 form1.classList.add('form_none');
 form2.classList.remove('form_none');
 title.textContent="ТТ без стикеров";
  } else {
    counter_1=0;
    arrayBarcode.length=0;
    inputCounter.textContent='Отсканировано ШК: '+counter_1;
    inputCounter_2.textContent='Отсканировано ШК: '+counter_1;
    inputForm_3.value='';
    inputForm_2.value='';
    inputForm.value='';
    inputButton.setAttribute('disabled', '');
 form1.classList.remove('form_none');
 form2.classList.add('form_none');
 title.textContent="Проверка НТ";
  }
 } 
// ******************************************************************************

// слушатели кнопки обновления и смена формы **********************************************
rlButton.addEventListener('click', () => {  
  setTimeout(() => { 
   img.classList.add('svg_img_rotate');  
  },300);
  setTimeout(() => { 
    img.classList.remove('svg_img_rotate'); 
  },1200);
  setTimeout(() => { 
    if (counter_1>=5) {
      ntreload();
    } else {
      location.reload();
    }
  },1600);
}); 

tgButton.addEventListener('click', () => {  
  setTimeout(() => { 
    img_tg.classList.add('svg_toggle_rotate');  
  },200);  
  setTimeout(() => { 
    img_tg.classList.remove('svg_toggle_rotate'); 
  },1100);
  setTimeout(() => { 
    if (counter_1>=5) {
      tgreload();
    } else {
      toggleForm();
    }
  },1600);
  }); 

// *******************************************************************************

// функции обработки перезагрузок ************************************************
function ntreload() {
popup.classList.add('popup__visible');
message.textContent = "есть отсканированные ШК: " + counter_1;
popupButton.addEventListener('click', () => {
  popup.classList.remove('popup__visible');
  counter_1=0;
  inputForm.value='';
  inputCounter.textContent='Отсканировано ШК: '+ counter_1;
  location.reload();
});
}

function tgreload() {
    popup.classList.add('popup__visible');
    message.textContent = "есть отсканированные ШК: " + counter_1;
    popupButton.addEventListener('click', listenerTG);
};

function listenerTG () {
  popup.classList.remove('popup__visible');
  toggleForm();
  popupButton.removeEventListener('click',listenerTG);
}
// ***************************************************************** 
  
// кнопка закрытия попапа ******************************************
popupClose.addEventListener('click', () => {
  popup.classList.remove('popup__visible');
});
// *****************************************************************

function sendEmail() {
  document.location = "mailto:" + selects.value +"?subject=" + subjectText +"&body=" + emailBodyText;
  technical = selects.value;
  selects.value="";

}



