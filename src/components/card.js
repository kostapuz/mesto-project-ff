import { cardTemplate, renderLoading, setIdToDeleteCard} from "../pages";
import { addLike, deleteLike, deleteCardFromServer, changeLike } from "./api";
import { openModal } from "./modal";
import { validationSettings } from "./validation";
export { createCard, deleteCard, renderLoading };

// @todo: Функция создания карточки
function createCard(data, handleDeleteCard, toFullImage, changeLike, userId) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardDeleteButton = card.querySelector(".card__delete-button");
  const cardTitle = card.querySelector(".card__title");
  const cardLikeButton = card.querySelector(".card__like-button");
  const cardLikesCounter = card.querySelector(".card__like-counter");
  //const confirmDeletePopup = document.querySelector(".popup_type_confirm-delete");

  const cardId = data._id;
  const ownerId = data.owner._id;
  const likesLength = data.likes.length;
  const isOwner = userId === ownerId;

  // Заполнить атрибуты картинки и текста данными
  cardTitle.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = `Пейзаж ${data.name}`;

  //Добавить карточке атрибут с id для дальнейшего удаления с попапом подтверждения
  card.setAttribute("card-id", cardId);

  //Если карточка принадлежит пользователю:
  if (isOwner) {
    //Добавить кнопку удаления - "корзинку"
    cardDeleteButton.style.display = "block";
    //Навесить слушатель на кнопку удаления - "корзинку"
    cardDeleteButton.addEventListener("click", () => handleDeleteCard(cardId));
  }
  //Проверить поставил ли лайк пользователь
  const userLikesArr = data.likes.filter((user) => user._id === userId);
  const isLiked = userLikesArr.length > 0;

  //Количество лайков - длина массива [likes] в data
  cardLikesCounter.textContent = likesLength;

  //Добавить стили лайку, если он поставлен
  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }
  //Навесить слушатели открытия полной картинки и кнопке постановки лайка
  cardImage.addEventListener("click", () => toFullImage(data));
  cardLikeButton.addEventListener("click", (evt) => changeLike(cardId, evt, cardLikesCounter));
  return card;
}


// Функция удалить карточку из разметки
function deleteCard(cardId) {
  return deleteCardFromServer(cardId)
}

