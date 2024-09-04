import { validationSettings } from "./validation";
//Функция открыть модальное окно
function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener('keydown', closePopupByEsc);
  popup.addEventListener('click', closePopupByClick);
}

//Функция закрыть модальное окно
function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener('keydown', closePopupByEsc);
  popup.removeEventListener('click', closePopupByClick);
  document.querySelector(validationSettings.formSelector).reset()//Вариант 2 - очищать формы при открытии попапа в слушателях в index.js
}

//Функция закрыть по ESC
function closePopupByEsc (evt) {
  if (evt.key === 'Escape') {
    closeModal(document.querySelector('.popup_is-opened'))
  }
}

//Функция закрыть по клику на Overlay/кнопку закрытия
function closePopupByClick (evt) {
  if (evt.currentTarget === evt.target || evt.target.classList.value.includes("popup__close")) {
    closeModal(evt.currentTarget)
  }
}

export {openModal, closeModal}

