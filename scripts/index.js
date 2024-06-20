// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;


// @todo: DOM узлы
const placesList = document.querySelector('.places__list');


// @todo: Функция создания карточки
 function createCard (data, deleteCard) {
  const clonedCardTemplate = cardTemplate.cloneNode(true);
  const placesItem = clonedCardTemplate.querySelector('.places__item');
  const cardImage = clonedCardTemplate.querySelector('.card__image');
  const cardDeleteButton = clonedCardTemplate.querySelector('.card__delete-button');
  const cardTitle = clonedCardTemplate.querySelector('.card__title');
  const cardLikeButton = clonedCardTemplate.querySelector('.card__like-button');

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = 'Карточка c пейзажами';

  cardDeleteButton.addEventListener('click', deleteCard);
  return placesItem;
 }

// @todo: Функция удаления карточки
function deleteCard (event) {
  event.target.closest('.places__item').remove();
};

// @todo: Вывести карточки на страницу
initialCards.forEach(card => placesList.append(createCard(card, deleteCard)));