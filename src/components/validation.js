//Объект настроек
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

//Функция показать текст ошибки и стилизовать ошибочный инпут
function showInputError(formElement, inputElement, errorMessage, validationSettings) {
  // span с текстом ошибки
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); 
  //стилизовать нижнее подчеркивание в инпуте
  inputElement.classList.add(validationSettings.inputErrorClass); 
  //стилизовать текст ошибки под импутом
  errorElement.classList.add(validationSettings.errorClass); 
  //присвоить текст ошибки span-у
  errorElement.textContent = errorMessage; 
}

//Функция скрыть ошибки
function hideInputError(formElement, inputElement, validationSettings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationSettings.inputErrorClass);
  errorElement.classList.remove(validationSettings.errorClass);
  errorElement.textContent = "";
}

//Функция проверить валидность 1го инпута с кастомным текстом
function checkInputValidy(formElement, inputElement, validationSettings) {
  //Если ошибка из-за нарушения паттерна, вывести кастомное сообщение ошибки
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    //Иначе сбросить кастомное сообщение ошибки (вернуть браузерное по умолчанию)
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationSettings);
  } else {
    hideInputError(formElement, inputElement, validationSettings);
  }
}

//Функция вернуть невалидный импут(true/false)
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

//Функция отключить кнопку "Сохранить" при невалидных данных
function toggleButtonStatus(inputList, buttonElement, validationSettings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationSettings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationSettings.inactiveButtonClass);
  }
}

//Функция проверить валидность всех инпутов в 1 форме и изменить работу кнопки "Сохранить"
function checkFormInputs(formElement, validationSettings) {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationSettings.submitButtonSelector
  );
  toggleButtonStatus(inputList, buttonElement, validationSettings);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidy(formElement, inputElement, validationSettings);
      toggleButtonStatus(inputList, buttonElement, validationSettings);
    });
  });
}

//Функция проверить валидность всех инпутов во всех формах
function enableValidation(validationSettings) {
  document.querySelectorAll(validationSettings.formSelector).forEach((formElement) => {
      formElement.addEventListener("submit", function (evt) {
        evt.preventDefault();
      });
      checkFormInputs(formElement, validationSettings);
      formElement.reset();
    });
}

//Функция очистить ошибки валидации и сделать кнопку "Сохранить" неактивной
function clearValidation(formElement, validationSettings) {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector)
  );
  inputList.forEach((inputElement) =>
    hideInputError(formElement, inputElement, validationSettings)
  );
  formElement.querySelector(
    validationSettings.submitButtonSelector
  ).disabled = true;
  formElement
    .querySelector(validationSettings.submitButtonSelector)
    .classList.add(validationSettings.inactiveButtonClass);
}

export { validationSettings, enableValidation, clearValidation };
