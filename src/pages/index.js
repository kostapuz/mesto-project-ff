import "./index.css";
// import { initialCards } from "../components/cards.js";
import { createCard, deleteCard } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";
import {
  validationSettings,
  enableValidation,
  clearValidation,
} from "../components/validation.js";
import {
  getCardsFromApi,
  getUserInfoFromApi,
  updateProfileInfo,
  addNewCard,
  updateAvatar,
  addLike,
  deleteLike,
} from "../components/api.js";
export { cardTemplate, renderLoading, changeLike };

// @todo: DOM узлы
const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

const popups = Array.from(document.querySelectorAll(".popup"));
const popupAvatar = document.querySelector(".popup_type_avatar");
const popupEditProfile = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const confirmDeletePopup = document.querySelector(".popup_type_confirm-delete");

const previewImage = document.querySelector(".popup__image");
const previewCaption = document.querySelector(".popup__caption");

const addCardButton = document.querySelector(".profile__add-button");

const profileAvatar = document.querySelector(".profile__image");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileEditButton = document.querySelector(".profile__edit-button");

const forms = Array.from(document.querySelectorAll(".popup__form"));
const formElement = document.querySelector(".popup__form");
const avatarForm = document.forms["avatar"];
const editProfileForm = document.forms["edit-profile"];
const newPlaceForm = document.forms["new-place"];
const confirmDeleteForm = document.forms["confirm-delete"];

const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");

let userId, cardToDelete, cardId;

//Получить одновременно с сервера все карточки и инфо о пользователе и добавить все карточки в разметку
Promise.all([getCardsFromApi(), getUserInfoFromApi()])
  .then(([cardsFromApi, userInfoFromApi]) => {
    userId = userInfoFromApi._id;
    //Присвоить профилю значения по умолчанию
    profileTitle.textContent = userInfoFromApi.name;
    profileDescription.textContent = userInfoFromApi.about;
    profileAvatar.style.backgroundImage = `url(${userInfoFromApi.avatar})`;
    //Добавить все карточки в разметку
    cardsFromApi.forEach((data) => {
      const card = createCard(data, prepareDeleteCard, toFullImage, changeLike, userId);
      placesList.append(card);
    });
  })
  .catch((err) =>
    console.error("Упс! Ошибка при загрузке данных о пользователе или карточках", err));


//Функция открыть попап с данными Профиля
function openPopupTypeProfile() {
  //Присвоить значения импутам по умолчанию
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

//Функция сохранить данные. Форма с Профилем.
function saveEditedProfileData(data, button) {
  renderLoading(true, button);
  //Обработать ответ от сервера
  updateProfileInfo(data)
    .then((profileInfo) => {
      profileTitle.textContent = profileInfo.name;
      profileDescription.textContent = profileInfo.about;
      closeAndClearForm(popupEditProfile, editProfileForm);
    })
    .catch((err) => {
      alert("Упс! Видимо что-то пошло не так! Невозможно внести изменения...")
      console.error("Ошибка при обновлении данных профиля!", err)
    })
    .finally(() => renderLoading(false, button));
}

//Функция добавить карточку. Форма с новой карточкой.
function saveImageData(data, button) {
  renderLoading(true, button);
  //Обработать ответ с сервера
  addNewCard(data)
    .then((card) => {
      //Добавить новую карточку в начало разметки
      placesList.prepend(createCard(card, prepareDeleteCard, toFullImage, changeLike, userId));
      closeAndClearForm(popupNewCard, newPlaceForm);
    })
    .catch((err) => {
      alert("Упс! Видимо что-то пошло не так! Невозможно добавить карточку...")
      console.error("Ошибка при добавлении карточки!", err)
    })
    .finally(() => renderLoading(false, button));
}

//Функция открыть попап подтверждения удаления
function prepareDeleteCard(card) {
  cardToDelete = card;
  openModal(confirmDeletePopup);
}

//Функция подтвердить удаление с сервера
function handleSubmitDeleteCard() {
  cardId = cardToDelete.getAttribute("card-id");
  //Обработать ответ с сервера
  deleteCard(cardId)
    .then(() => {
      cardToDelete.closest(".card").remove();
      //Снять слушатель с кнопки удаления - "корзинки"
      cardToDelete.querySelector(".card__delete-button").removeEventListener("submit", prepareDeleteCard);
      closeAndClearForm(confirmDeletePopup, confirmDeleteForm);
    })
    .catch((err) => {
      alert("Упс! Видимо что-то пошло не так! Невозможно удалить карточку...")
      console.error("Упс! Ошибка при удалении карточки!", err)
    });
}

//Функция сохранить новый Аватар. Форма с Аватаром
function saveAvatarData(avatarLink, button) {
  renderLoading(true, button);
  //Обработать ответ с сервера
  updateAvatar(avatarLink)
    .then((data) => {
      profileAvatar.style.backgroundImage = `url(${data.avatar})`;
      closeAndClearForm(popupAvatar, avatarForm);
    })
    .catch((err) => {
      alert("Упс! Видимо что-то пошло не так! Невозможно поменять аватар...")
      console.error("Ошибка с данными Аватара", err)
    })
    .finally(() => renderLoading(false, button));
}

//Функция универсальная - проверить и сохранить данные для всех форм.
function handleFormSubmit(evt) {
  evt.preventDefault();

  const formElement = evt.target;
  const formName = formElement.getAttribute("name");
  const formSubmitButton = formElement.querySelector(validationSettings.submitButtonSelector);
  const data = {};

  switch (formName) {
    case "edit-profile":
      data.name = formElement.elements["name"].value;
      data.job = formElement.elements["description"].value;
      saveEditedProfileData(data, formSubmitButton);
      break;
    case "new-place":
      data.name = formElement.elements["place-name"].value;
      data.link = formElement.elements["link"].value;
      saveImageData(data, formSubmitButton);
      break;
    case "confirm-delete":
      handleSubmitDeleteCard();
      break;
    case "avatar":
      data.link = formElement.elements["link"].value;
      saveAvatarData(data.link, formSubmitButton);
      break;
    default:
      console.error("К сожалению, форма не найдена");
  }
}

//Функция очистить форму и закрыть попап при успешном ответе сервера
function closeAndClearForm(popup, formElement) {
  formElement.reset();
  closeModal(popup);
}

//Функция показать на кнопке процесс загрузки данных
function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
}

// Функция управлять лайком
function changeLike(cardId, evt, cardLikesCounter) {
  const isLiked = evt.target.classList.value.includes(
    "card__like-button_is-active"
  );
  if (isLiked) {
    //Обработать ответ от сервера
    deleteLike(cardId)
      .then((data) => {
        evt.target.classList.remove("card__like-button_is-active");
        cardLikesCounter.textContent = data.likes.length;
      })
      .catch((err) => console.error("Невозможно удалить лайк", err));
  } else {
    //Обработать ответ от сервера
    addLike(cardId)
      .then((data) => {
        evt.target.classList.add("card__like-button_is-active");
        cardLikesCounter.textContent = data.likes.length;
      })
      .catch((err) => console.error("Невозможно поставить лайк", err));
  }
}

// Функция увеличить размер картинки
function toFullImage(data) {
  openModal(popupImage);

  previewImage.src = data.link;
  previewImage.alt = `Изображение ${data.name}`;
  previewCaption.textContent = data.name;
}

//Навесить слушатель сабмита на каждую форму
forms.forEach((formElement) => {
  formElement.addEventListener("submit", handleFormSubmit);
});

//Навесить слушатель на картинку открытия аватара
profileAvatar.addEventListener("click", () => {
  openModal(popupAvatar);
  clearValidation(popupAvatar, validationSettings);
  //Очистить форму
  avatarForm.reset();
});

//Навесить слушатель на кнопку редактирования Профиля
profileEditButton.addEventListener("click", () => {
  openModal(popupEditProfile);
  openPopupTypeProfile();
  clearValidation(popupEditProfile, validationSettings);
});

// Навесить слушатель на кнопку добавления новых карточек
addCardButton.addEventListener("click", () => {
  openModal(popupNewCard);
  clearValidation(popupNewCard, validationSettings);
  newPlaceForm.reset();
});

//Добавить класс плавного открытия/закрытия каждому попапу
popups.forEach((elem) => elem.classList.add("popup_is-animated"));

//Вызвать валидацию всех форм
enableValidation(validationSettings);
