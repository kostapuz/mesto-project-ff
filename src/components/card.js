import { cardTemplate } from "../pages";
import { addLike, deleteLike, deleteCardFromServer } from "./api";
import { openModal } from "./modal";
import { validationSettings } from "./validation";
export { createCard, changeLike, deleteCard, renderLoading };

// @todo: Функция создания карточки
function createCard(data, deleteCard, toFullImage, changeLike, userId) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardDeleteButton = card.querySelector(".card__delete-button");
  const cardTitle = card.querySelector(".card__title");
  const cardLikeButton = card.querySelector(".card__like-button");
  const cardLikesCounter = card.querySelector(".card__like-counter");
  const confirmDeletePopup = document.querySelector(".popup_type_confirm-delete");

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

  //Если карточка принадлежит пользователю добавить кнопку удаления
  if (isOwner) {
    cardDeleteButton.style.display = "block";
    const confirmDeleteForm = confirmDeletePopup.querySelector(
      validationSettings.formSelector
    );
    cardDeleteButton.addEventListener("click", () => {
      openModal(confirmDeletePopup);
      confirmDeleteForm.addEventListener("submit", handleFormSubmit);
    });

    //Снять слушатель при удалении более чем 1 своей карточки
    const handleFormSubmit = (evt) => {
      evt.preventDefault();
      deleteCard(cardId);
      confirmDeleteForm.removeEventListener("submit", handleFormSubmit);
    };
  }

  //Проверить поставил ли лайк пользователь
  const userLikesArr = data.likes.filter((user) => user._id === userId);
  const isLiked = userLikesArr.length > 0;
  //Количество лайков - длина массива [likes] в data
  cardLikesCounter.textContent = likesLength;

  //Добавить стили если лайку, если он поставлен
  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }
  //Навесить слушатели  открытия полной картинки и постановки лайка
  cardImage.addEventListener("click", () => toFullImage(data));
  cardLikeButton.addEventListener("click", (evt) =>
    changeLike(cardId, evt, cardLikesCounter)
  );
  return card;
}

// Функция поставить лайк
function changeLike(cardId, evt, cardLikesCounter) {
  const isLiked = evt.target.classList.value.includes(
    "card__like-button_is-active"
  );
  if (isLiked) {
    deleteLike(cardId).then((data) => {
      evt.target.classList.remove("card__like-button_is-active");
      cardLikesCounter.textContent = data.likes.length;
    });
  } else {
    addLike(cardId).then((data) => {
      evt.target.classList.add("card__like-button_is-active");
      cardLikesCounter.textContent = data.likes.length;
    });
  }
}

// Функция удалить карточку из разметки
function deleteCard(cardId) {
  deleteCardFromServer(cardId).then(() => {
    const cards = Array.from(document.querySelectorAll(".card"));
    cards.forEach((card) => {
      if (card.getAttribute("card-id") === cardId) {
        card.closest(".card").remove();
      }
    });
  });
}

//Функция показать процесс загрузки данных
function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
}
