// selectors 
const cardTemplate = document.querySelector("#card-template").content; 
 
// functions 
function createCard(card, deleteFunction, likeFunction, openImageFunction){ 
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true); 
  cardElement 
    .querySelector(".card__delete-button") 
    .addEventListener("click", deleteFunction); 
  cardElement 
    .querySelector(".card__like-button") 
    .addEventListener("click", likeFunction); 
 
  cardElement.querySelector(".card__title").textContent = card.name; 
  cardElement.querySelector(".card__image").src = card.link; 
  cardElement.querySelector(".card__image").alt = card.alt; 
  cardElement 
    .querySelector(".card__image") 
    .addEventListener("click", () => { 
      openImageFunction(card.link, card.alt, card.name); 
    }); 
  return cardElement; 
}; 
 
const renderCard = (item,container,likeCard,deleteCard,openFullImageFn,place = "end") => { 
  const cardElement = createCard(item, deleteCard, likeCard, openFullImageFn); 
  if (place === "end") { 
    container.append(cardElement); 
  } else { 
    container.prepend(cardElement); 
  } 
}; 
 
export { renderCard };
