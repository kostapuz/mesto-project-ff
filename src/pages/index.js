import "./index.css";
import { initialCards } from "../components/cards.js";
import { createCard, changeLike, deleteCard } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";
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
const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const forms = Array.from(document.querySelectorAll(".popup__form"));

// @todo: Вывести карточки на страницу - вызов функции createCard
initialCards.forEach((data) => {
  const card = createCard(data, deleteCard, toFullImage, changeLike);
  placesList.append(card);
});

//Функция редактировать данные Профиля
function openPopupTypeEdit(popup) {
  const formElement = popup.querySelector(".popup__form");
  const nameInput = formElement.querySelector(".popup__input_type_name");
  const jobInput = formElement.querySelector(".popup__input_type_description");

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
}

// Функция режима полного экрана картинки
function toFullImage(data) {
  openModal(popupImage);

  previewImage.src = data.link;
  previewImage.alt = `Изображение ${data.name}`;
  previewCaption.textContent = data.name;
}

//Функция сохранить данные только для формы с Профилем
function saveEditData(data) {
  profileTitle.textContent = data.name;
  profileDescription.textContent = data.job;
}

//Функция добавить карточку для формы с новой карточкой
function saveImageData(data) {
  placesList.prepend(createCard(data, deleteCard, toFullImage, changeLike));
}

//Функция Универсальная проверяет и сохраняет данные для всех форм
function handleFormSubmit(evt) {
  evt.preventDefault();
  const formElement = evt.target;
  const inputs = formElement.querySelectorAll(".popup__input");
  const formName = formElement.getAttribute("name");
  const data = {};
  switch (formName) {
    case "edit-profile":
      data.name = inputs[0].value;
      data.job = inputs[1].value;
      saveEditData(data);
      break;
    case "new-place":
      data.name = inputs[0].value;
      data.link = inputs[1].value;
      saveImageData(data);
      break;
    default:
      console.error("Форма не найдена");
  }
  const popup = formElement.closest(".popup");
  closeModal(popup);
  formElement.reset();
}

// Навесил слушатель на кнопку редактирования Профиля
profileEditButton.addEventListener("click", () => {
  openModal(popupEditProfile);
  openPopupTypeEdit(popupEditProfile);
});

// Навесил слушатель на кнопку добавления новых карточек
addCardButton.addEventListener("click", () => {
  openModal(popupNewCard);
});

//Навесил слушатель сабмита на каждую форму
forms.forEach((formElement) =>
  formElement.addEventListener("submit", handleFormSubmit)
);

popups.forEach((elem) => elem.classList.add("popup_is-animated"));
