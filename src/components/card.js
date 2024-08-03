import { cardTemplate } from "../pages";
// @todo: Функция создания карточки
function createCard(data, deleteCard, toFullImage, changeLike) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardDeleteButton = card.querySelector(".card__delete-button");
  const cardTitle = card.querySelector(".card__title");
  const cardLikeButton = card.querySelector(".card__like-button");

  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = `Пейзаж ${data.name}`;

  cardDeleteButton.addEventListener("click", deleteCard);
  cardImage.addEventListener("click", () => toFullImage(data));
  cardLikeButton.addEventListener("click", changeLike);
  return card;
}

// Функция поставить лайк
function changeLike(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
  evt.target.closest(".card").remove();
}

export { createCard, changeLike, deleteCard };
