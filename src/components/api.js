export {
  getCardsFromApi,
  getUserInfoFromApi,
  updateProfileInfo,
  addNewCard,
  addLike,
  deleteLike,
  deleteCardFromServer,
  updateAvatar,
};

//Объект шаблона запросов к серверу
const requestConfig = {
  baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-21",
  headers: {
    authorization: "d1e6eae8-492b-4dec-a2cd-4e5dabb64746",
    "Content-Type": "application/json",
  },
};

//Функция обработать ответ от сервера
function handleApiResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Упс! Ошибка:${res.status}`);
}

//Функция получить массив объектов с карточками с сервера
function getCardsFromApi() {
  return fetch(`${requestConfig.baseUrl}/cards`, {
    headers: requestConfig.headers,
  }).then(handleApiResponse);
}

//Функция получить информацию о владельце
function getUserInfoFromApi() {
  return fetch(`${requestConfig.baseUrl}/users/me`, {
    headers: requestConfig.headers,
  }).then(handleApiResponse);
}

//Функция обновить данные Профиля
function updateProfileInfo(data) {
  return fetch(`${requestConfig.baseUrl}/users/me`, {
    method: "PATCH",
    headers: requestConfig.headers,
    body: JSON.stringify({
      name: data.name,
      about: data.job,
    }),
  }).then(handleApiResponse);
}

//Функция добавить новую карточку на сервер
function addNewCard(data) {
  return fetch(`${requestConfig.baseUrl}/cards`, {
    method: "POST",
    headers: requestConfig.headers,
    body: JSON.stringify({
      name: data.name,
      link: data.link,
    }),
  }).then(handleApiResponse);
}

//Функция удалить карточку с сервера
function deleteCardFromServer(cardId) {
  return fetch(`${requestConfig.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: requestConfig.headers,
  }).then(handleApiResponse);
}

//Функция добавить лайк
function addLike(cardId) {
  return fetch(`${requestConfig.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: requestConfig.headers,
  }).then(handleApiResponse);
}

//Функция удалить лайк
function deleteLike(cardId) {
  return fetch(`${requestConfig.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: requestConfig.headers,
  }).then(handleApiResponse);
}

//Функция обновить аватар
function updateAvatar(avatar) {
  return fetch(`${requestConfig.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: requestConfig.headers,
    body: JSON.stringify({
      avatar,
    }),
  }).then(handleApiResponse);
}