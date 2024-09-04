import "./index.css";
//import { initialCards } from "../components/cards.js";
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
export { cardTemplate, renderLoading, changeLike, setIdToDeleteCard };

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

const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");

let userId
let cardIdToDelete 

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
      const card = createCard(data, handleDeleteCard, toFullImage, changeLike, userId);
      placesList.append(card);
    });
  })
  .catch((err) => console.error("Упс! Ошибка при загрузке данных о пользователе или карточках", err));

//Функция открыть попап с данными Профиля
function openPopupTypeProfile() {
  //Присвоить значения импутам по умолчанию
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

//Функция сохранить данные. Форма с Профилем
function saveEditedProfileData(data, button) {
  //Показать лоадер в кнопке
  renderLoading(true, button);
  return updateProfileInfo(data);
}

//Функция сохранить новый аватар. Форма с аватаром
function saveAvatarData(avatarLink, button) {
  //Показать лоадер в кнопке
  renderLoading(true, button);
  return updateAvatar(avatarLink);
}

//Функция добавить карточку. Форма с новой карточкой.
function saveImageData(data, button) {
  //Показать лоадер в кнопке
  renderLoading(true, button);
  return addNewCard(data);
}

//Функция установить Id карточке для ее удаления
function setIdToDeleteCard(cardId) {
  cardIdToDelete = cardId;
}

//Функция удалить карточку
function handleDeleteCard(cardId){
  setIdToDeleteCard(cardId)
  openModal(confirmDeletePopup);
}

//Функция подтвердить удаление с сервера
function handleSubmitDeleteCard() {
  return deleteCard(cardIdToDelete);
}

//Функция очистить форму и закрыть попап при запросе на сервер
function closeAndClearForm(popup, formElement) {
  formElement.reset();
  closeModal(popup);
}

// Функция увеличить размер картинки
function toFullImage(data) {
  openModal(popupImage);

  previewImage.src = data.link;
  previewImage.alt = `Изображение ${data.name}`;
  previewCaption.textContent = data.name;
}

// Функция управлять лайком
function changeLike(cardId, evt, cardLikesCounter) {
  const isLiked = evt.target.classList.value.includes("card__like-button_is-active");
  if (isLiked) {
    deleteLike(cardId)
      .then((data) => {
        evt.target.classList.remove("card__like-button_is-active");
        cardLikesCounter.textContent = data.likes.length;
      })
      .catch((err) => console.error("Невозможно удалить лайк", err));
  } else {
    addLike(cardId)
      .then((data) => {
        evt.target.classList.add("card__like-button_is-active");
        cardLikesCounter.textContent = data.likes.length;
      })
      .catch((err) => console.error("Невозможно поставить лайк", err));
  }
}

//Функция показать процесс загрузки данных
function renderLoading(isLoading, button) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
}

//Функция универсальная проверить и сохранить данные для всех форм.
//Взаимодействие с сервером.
function handleFormSubmit(evt) {
  evt.preventDefault();

  const formElement = evt.target;
  const popup = formElement.closest(".popup");
  const formName = formElement.getAttribute("name");
  const formSubmitButton = formElement.querySelector(validationSettings.submitButtonSelector);
  const data = {};

  switch (formName) {
    case "edit-profile":
      data.name = formElement.elements["name"].value;
      data.job = formElement.elements["description"].value;
      saveEditedProfileData(data, formSubmitButton)
        .then((profileInfo) => {
          profileTitle.textContent = profileInfo.name;
          profileDescription.textContent = profileInfo.about;
          closeAndClearForm(popup, formElement);
        })
        .catch((err) => console.error("Ошибка с данными Профиля", err))
        .finally(() => renderLoading(false, formSubmitButton));
    break;
    case "new-place":
      data.name = formElement.elements["place-name"].value;
      data.link = formElement.elements["link"].value;
      saveImageData(data, formSubmitButton)
        .then((card) => {
          //Добавить новую карточку в начало разметки
          placesList.prepend(createCard(card, handleDeleteCard, toFullImage, changeLike, userId));
          closeAndClearForm(popup, formElement);
        })
        .catch((err) =>
          console.error("Упс! Ошибка при добавлении карточки!", err)
        )
        .finally(() => renderLoading(false, formSubmitButton));
    break;
    case "confirm-delete":
      handleSubmitDeleteCard()
        .then(() => {
          const cards = Array.from(document.querySelectorAll(".card"));
          cards.forEach((card) => {
            if (card.getAttribute("card-id") === cardIdToDelete) {
              card.closest(".card").remove();
            }
          });
          //Снять слушатель подтверждения удаления карточки
          formElement.removeEventListener("submit", handleSubmitDeleteCard);
          closeAndClearForm(popup, formElement);
        })
        .catch((err) => console.error("Упс! Ошибка при удалении карточки!", err));
    break;
    case "avatar":
      data.link = formElement.elements["link"].value;
      saveAvatarData(data.link, formSubmitButton)
        .then((data) => {
          profileAvatar.style.backgroundImage = `url(${data.avatar})`;
          closeAndClearForm(popup, formElement);
        })
        .catch((err) => console.error("Ошибка с данными Аватара", err))
        .finally(() => renderLoading(false, formSubmitButton));
      break;
    default:
      console.error("К сожалению, форма не найдена");
  }
}

//Навесить слушатель сабмита на каждую форму
forms.forEach((formElement) => {
  formElement.addEventListener("submit", handleFormSubmit);
});

//Навесить слушатель на картинку открытия аватара
profileAvatar.addEventListener("click", () => {
  openModal(popupAvatar);
  clearValidation(popupAvatar, validationSettings);
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
});

//Добавить класс плавного открытия/закрытия каждому попапу
popups.forEach((elem) => elem.classList.add("popup_is-animated"));

//Вызвать валидацию всех форм
enableValidation(validationSettings);
