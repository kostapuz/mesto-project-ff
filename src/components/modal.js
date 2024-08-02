//Функция открывать модальное окно
function openModal(popup) {
  popup.classList.add("popup_is-opened");
}

//Функция закрыть модальное окно
function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
}

export {openModal, closeModal}


