import "./index.css";
import { initialCards } from "../components/cards.js";
import { createCard, changeLike, deleteCard } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");
const popup = document.querySelector(".popup");
const popups = Array.from(document.querySelectorAll(".popup"));
const popupImage = document.querySelector(".popup_type_image");
const previewImage = document.querySelector(".popup__image");
const previewCaption = document.querySelector(".popup__caption");
const popupEditProfile = document.querySelector(".popup_type_edit");
const closeEditProfileBtn = popupEditProfile.querySelector(".popup__close");
const popupNewCard = document.querySelector(".popup_type_new-card");
const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

export { cardTemplate };

// Функция режима полного экрана картинки
function toFullImage(data) {
  openModal(popupImage);

  previewImage.src = data.link;
  previewImage.alt = `Изображение ${data.name}`;
  previewCaption.textContent = data.name;

  addEventToPopup(popupImage);
}

// @todo: Вывести карточки на страницу
initialCards.forEach((data) => {
  let card = createCard(data, deleteCard, toFullImage, changeLike);
  placesList.append(card);
});

// Функция навесить слушатель на модальноe окно и закрыть его 3-мя способами
function addEventToPopup(popup) {
  popup.addEventListener("click", closePopup);
  document.addEventListener("keyup", closePopup);
  function closePopup(evt) {
    const evtClassList = evt.target.classList.value;
    if (evt.key === "Escape") {
      closeModal(popup);
    }
    if (
      evt.currentTarget === evt.target ||
      evtClassList.includes("popup__close")
    ) {
      closeModal(popup);
    }
    evt.target.removeEventListener("click", closePopup);
  }
}

// Навесил слушатель на кнопку редактирования профайла
profileEditButton.addEventListener("click", () => {
  openModal(popupEditProfile);
  addEventToPopup(popupEditProfile);
  openPopupTypeEdit(popupEditProfile);
});

// Навесил слушатель на кнопку добавления новых карточек
addCardButton.addEventListener("click", () => {
  openModal(popupNewCard);
  addEventToPopup(popupNewCard);
  openPopupTypeImage(popupNewCard);
});

//Функция редактировать профиль
function openPopupTypeEdit(popup) {
  const formElement = popup.querySelector(".popup__form");
  const nameInput = formElement.querySelector(".popup__input_type_name");
  const jobInput = formElement.querySelector(".popup__input_type_description");
  let profileTitle = document.querySelector(".profile__title");
  let profileDescription = document.querySelector(".profile__description");

  nameInput.placeholder = profileTitle.textContent; //как альтернатива .value
  jobInput.placeholder = profileDescription.textContent; //как альтернатива .value

  function handleFormSubmit(evt) {
    evt.preventDefault();
    if (!nameInput.value || !jobInput.value) {
      return null;
    }

    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(popup);

    formElement.removeEventListener("submit", handleFormSubmit);
  }
  formElement.addEventListener("submit", handleFormSubmit);
}

//Функция добавить новую карточку по SUBMIT
function openPopupTypeImage(popup) {
  const formElement = popup.querySelector(".popup__form");
  const nameInput = formElement.querySelector(".popup__input_type_card-name");
  const linkInput = formElement.querySelector(".popup__input_type_url");

  function handleFormSubmit(evt) {
    evt.preventDefault();
    if (!nameInput.value || !linkInput.value) {
      return null;
    }
    const data = {
      name: nameInput.value,
      link: linkInput.value,
    };
    placesList.prepend(createCard(data, deleteCard, toFullImage, changeLike));
    closeModal(popup);
    formElement.removeEventListener("submit", handleFormSubmit);
    formElement.reset();
  }
  formElement.addEventListener("submit", handleFormSubmit);
}

popups.forEach((elem) => elem.classList.add("popup_is-animated"));
