// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;


// @todo: DOM узлы
const placesList = document.querySelector('.places__list');


// @todo: Функция создания карточки
 function createCard (data, deleteCard) {
  
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardDeleteButton = card.querySelector('.card__delete-button');
  const cardTitle = card.querySelector('.card__title');
  const cardLikeButton = card.querySelector('.card__like-button');

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = 'Карточка c пейзажами';

  cardDeleteButton.addEventListener('click', deleteCard);
  
  return card;
 }


// @todo: Функция удаления карточки
function deleteCard (event) {
  event.target.closest('.card').remove();
};


// @todo: Вывести карточки на страницу
initialCards.forEach(card => placesList.append(createCard(card, deleteCard)));