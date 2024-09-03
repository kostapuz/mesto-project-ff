import "./index.css";
//import { initialCards } from "../components/cards.js";
import {
  createCard,
  changeLike,
  deleteCard,
  renderLoading,
} from "../components/card.js";
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
} from "../components/api.js";
export { cardTemplate };

// @todo: DOM узлы
const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const popups = Array.from(document.querySelectorAll(".popup"));
const popupImage = document.querySelector(".popup_type_image");
const previewImage = document.querySelector(".popup__image");
const previewCaption = document.querySelector(".popup__caption");
const popupEditProfile = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupAvatar = document.querySelector(".popup_type_avatar");
const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileAvatar = document.querySelector(".profile__image");
const profileDescription = document.querySelector(".profile__description");
const forms = Array.from(document.querySelectorAll(".popup__form"));
let userId = null;

//Получить одновременно с сервера все карточки и инфо о пользователе и вывести карточки в разметку
Promise.all([getCardsFromApi(), getUserInfoFromApi()])
  .then(([cardsFromApi, userInfoFromApi]) => {
    userId = userInfoFromApi._id;
    profileTitle.textContent = userInfoFromApi.name;
    profileDescription.textContent = userInfoFromApi.about;
    profileAvatar.style.backgroundImage = `url(${userInfoFromApi.avatar})`;

    cardsFromApi.forEach((data) => {
      const card = createCard(
        data,
        deleteCard,
        toFullImage,
        changeLike,
        userId
      );
      placesList.append(card);
    });
  })
  .catch((err) =>
    console.error(
      "Упс! Ошибка при загрузке данных о пользователе или карточках",
      err
    )
  );

//Функция редактировать данные Профиля
function editPopupTypeProfile(popup) {
  const formElement = popup.querySelector(validationSettings.formSelector);
  const nameInput = formElement.querySelector(".popup__input_type_name");
  const jobInput = formElement.querySelector(".popup__input_type_description");
  //Присвоить значения импутам по умолчанию
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

//Функция сохранить данные. Форма с Профилем
function saveEditedProfileData(data, button) {
  renderLoading(true, button);
  updateProfileInfo(data)
    .then((profileInfo) => {
      profileTitle.textContent = profileInfo.name;
      profileDescription.textContent = profileInfo.about;
    })
    .catch((err) => console.error("Данные профиля не пришли", err))
    .finally(() => renderLoading(false, button));
}

//Функция сохранить новый аватар. Форма с аватаром
function saveAvatarData(avatarLink, button) {
  renderLoading(true, button);
  updateAvatar(avatarLink)
    .then((data) => {
      console.log(data);
      profileAvatar.style.backgroundImage = `url(${data.avatar})`;
    })
    .finally(() => renderLoading(false, button));
}

//Функция добавить карточку. Форма с новой карточкой
function saveImageData(data, button) {
  renderLoading(true, button);
  addNewCard(data)
    .then((сard) => {
      // Добавить все карточки в разметку
      placesList.prepend(createCard(сard, deleteCard, toFullImage, changeLike, userId)); 
    })
    .finally(() => renderLoading(false, button));
}

// Функция увеличить размер картинки
function toFullImage(data) {
  openModal(popupImage);

  previewImage.src = data.link;
  previewImage.alt = `Изображение ${data.name}`;
  previewCaption.textContent = data.name;
}

//Функция Универсальная проверить и сохранить данные для всех форм
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
      break;
    case "avatar":
      data.link = formElement.elements["link"].value;
      saveAvatarData(data.link, formSubmitButton);
      break;
    default:
      console.error("Форма не найдена");
  }
  const popup = formElement.closest(".popup");
  closeModal(popup);
  formElement.reset();
}

//Навесить слушатель на картинку открытия аватара
profileAvatar.addEventListener("click", () => {
  openModal(popupAvatar);
  clearValidation(popupAvatar, validationSettings);
  //Добавить очищение инпутов при повторном открытии
  document.forms["avatar"].reset();
});

//Навесить слушатель на кнопку редактирования Профиля
profileEditButton.addEventListener("click", () => {
  openModal(popupEditProfile);
  editPopupTypeProfile(popupEditProfile);
  clearValidation(popupEditProfile, validationSettings);
});

// Навесить слушатель на кнопку добавления новых карточек
addCardButton.addEventListener("click", () => {
  openModal(popupNewCard);
  clearValidation(popupNewCard, validationSettings);
  //Добавить очищение инпутов при повторном открытии
  document.forms["new-place"].reset();
});

//Навесить слушатель сабмита на каждую форму
forms.forEach((formElement) => {
  formElement.addEventListener("submit", handleFormSubmit);
});

//Добавить класс плавного открытия/закрытия каждому попапу
popups.forEach((elem) => elem.classList.add("popup_is-animated"));

//Вызвать валидацию всех форм
enableValidation(validationSettings);
