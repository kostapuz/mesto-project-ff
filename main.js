(()=>{"use strict";var e={d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};e.d({},{Tp:()=>m});var t={baseUrl:"https://mesto.nomoreparties.co/v1/wff-cohort-21",headers:{authorization:"d1e6eae8-492b-4dec-a2cd-4e5dabb64746","Content-Type":"application/json"}};function r(e){return e.ok?e.json():Promise.reject("Упс! Ошибка:".concat(e.status))}var n={formSelector:".popup__form",inputSelector:".popup__input",submitButtonSelector:".popup__button",inactiveButtonClass:"popup__button_disabled",inputErrorClass:"popup__input_type_error",errorClass:"popup__error_visible"};function o(e,t,r){var n=e.querySelector(".".concat(t.id,"-error"));t.classList.remove(r.inputErrorClass),n.classList.remove(r.errorClass),n.textContent=""}function c(e,t){Array.from(e.querySelectorAll(t.inputSelector)).forEach((function(r){return o(e,r,t)})),e.querySelector(t.submitButtonSelector).disabled=!0,e.querySelector(t.submitButtonSelector).classList.add(t.inactiveButtonClass)}function a(e){e.classList.add("popup_is-opened"),document.addEventListener("keydown",i),e.addEventListener("click",l)}function u(e){e.classList.remove("popup_is-opened"),document.removeEventListener("keydown",i),e.removeEventListener("click",l),document.querySelector(n.formSelector).reset()}function i(e){"Escape"===e.key&&u(document.querySelector(".popup_is-opened"))}function l(e){(e.currentTarget===e.target||e.target.classList.value.includes("popup__close"))&&u(e.currentTarget)}function s(e,t,r,n,o){var c=m.querySelector(".card").cloneNode(!0),a=c.querySelector(".card__image"),u=c.querySelector(".card__delete-button"),i=c.querySelector(".card__title"),l=c.querySelector(".card__like-button"),s=c.querySelector(".card__like-counter"),d=e._id,f=e.owner._id,p=e.likes.length,y=o===f;i.textContent=e.name,a.src=e.link,a.alt="Пейзаж ".concat(e.name),c.setAttribute("card-id",d),y&&(u.style.display="block",u.addEventListener("click",(function(){return t(d)})));var _=e.likes.filter((function(e){return e._id===o})).length>0;return s.textContent=p,_&&l.classList.add("card__like-button_is-active"),a.addEventListener("click",(function(){return r(e)})),l.addEventListener("click",(function(e){return n(d,e,s)})),c}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}var f,p,m=document.querySelector("#card-template").content,y=document.querySelector(".places__list"),_=Array.from(document.querySelectorAll(".popup")),h=document.querySelector(".popup_type_avatar"),v=document.querySelector(".popup_type_edit"),b=document.querySelector(".popup_type_new-card"),S=document.querySelector(".popup_type_image"),k=document.querySelector(".popup_type_confirm-delete"),q=document.querySelector(".popup__image"),g=document.querySelector(".popup__caption"),E=document.querySelector(".profile__add-button"),L=document.querySelector(".profile__image"),C=document.querySelector(".profile__title"),A=document.querySelector(".profile__description"),x=document.querySelector(".profile__edit-button"),w=Array.from(document.querySelectorAll(".popup__form")),j=(document.querySelector(".popup__form"),document.forms.avatar,document.forms["edit-profile"]),T=(document.forms["new-place"],j.querySelector(".popup__input_type_name")),U=j.querySelector(".popup__input_type_description");function O(e){!function(e){p=e}(e),a(k)}function B(){return function(e){return fetch("".concat(t.baseUrl,"/cards/").concat(e),{method:"DELETE",headers:t.headers}).then(r)}(p)}function P(e,t){t.reset(),u(e)}function I(e){a(S),q.src=e.link,q.alt="Изображение ".concat(e.name),g.textContent=e.name}function D(e,n,o){n.target.classList.value.includes("card__like-button_is-active")?function(e){return fetch("".concat(t.baseUrl,"/cards/likes/").concat(e),{method:"DELETE",headers:t.headers}).then(r)}(e).then((function(e){n.target.classList.remove("card__like-button_is-active"),o.textContent=e.likes.length})).catch((function(e){return console.error("Невозможно удалить лайк",e)})):function(e){return fetch("".concat(t.baseUrl,"/cards/likes/").concat(e),{method:"PUT",headers:t.headers}).then(r)}(e).then((function(e){n.target.classList.add("card__like-button_is-active"),o.textContent=e.likes.length})).catch((function(e){return console.error("Невозможно поставить лайк",e)}))}function M(e,t){t.textContent=e?"Сохранение...":"Сохранить"}function N(e){e.preventDefault();var o,c,a,u=e.target,i=u.closest(".popup"),l=u.getAttribute("name"),d=u.querySelector(n.submitButtonSelector),m={};switch(l){case"edit-profile":m.name=u.elements.name.value,m.job=u.elements.description.value,function(e,n){return M(!0,n),function(e){return fetch("".concat(t.baseUrl,"/users/me"),{method:"PATCH",headers:t.headers,body:JSON.stringify({name:e.name,about:e.job})}).then(r)}(e)}(m,d).then((function(e){C.textContent=e.name,A.textContent=e.about,P(i,u)})).catch((function(e){return console.error("Ошибка с данными Профиля",e)})).finally((function(){return M(!1,d)}));break;case"new-place":m.name=u.elements["place-name"].value,m.link=u.elements.link.value,function(e,n){return M(!0,n),function(e){return fetch("".concat(t.baseUrl,"/cards"),{method:"POST",headers:t.headers,body:JSON.stringify({name:e.name,link:e.link})}).then(r)}(e)}(m,d).then((function(e){y.prepend(s(e,O,I,D,f)),P(i,u)})).catch((function(e){return console.error("Упс! Ошибка при добавлении карточки!",e)})).finally((function(){return M(!1,d)}));break;case"confirm-delete":B().then((function(){Array.from(document.querySelectorAll(".card")).forEach((function(e){e.getAttribute("card-id")===p&&e.closest(".card").remove()})),u.removeEventListener("submit",B),P(i,u)})).catch((function(e){return console.error("Упс! Ошибка при удалении карточки!",e)}));break;case"avatar":m.link=u.elements.link.value,(o=m.link,c=d,M(!0,c),a=o,fetch("".concat(t.baseUrl,"/users/me/avatar"),{method:"PATCH",headers:t.headers,body:JSON.stringify({avatar:a})}).then(r)).then((function(e){L.style.backgroundImage="url(".concat(e.avatar,")"),P(i,u)})).catch((function(e){return console.error("Ошибка с данными Аватара",e)})).finally((function(){return M(!1,d)}));break;default:console.error("К сожалению, форма не найдена")}}Promise.all([fetch("".concat(t.baseUrl,"/cards"),{headers:t.headers}).then(r),fetch("".concat(t.baseUrl,"/users/me"),{headers:t.headers}).then(r)]).then((function(e){var t,r,n=(r=2,function(e){if(Array.isArray(e))return e}(t=e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,c,a,u=[],i=!0,l=!1;try{if(c=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;i=!1}else for(;!(i=(n=c.call(r)).done)&&(u.push(n.value),u.length!==t);i=!0);}catch(e){l=!0,o=e}finally{try{if(!i&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(l)throw o}}return u}}(t,r)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?d(e,t):void 0}}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),o=n[0],c=n[1];f=c._id,C.textContent=c.name,A.textContent=c.about,L.style.backgroundImage="url(".concat(c.avatar,")"),o.forEach((function(e){var t=s(e,O,I,D,f);y.append(t)}))})).catch((function(e){return console.error("Упс! Ошибка при загрузке данных о пользователе или карточках",e)})),w.forEach((function(e){e.addEventListener("submit",N)})),L.addEventListener("click",(function(){a(h),c(h,n)})),x.addEventListener("click",(function(){a(v),T.value=C.textContent,U.value=A.textContent,c(v,n)})),E.addEventListener("click",(function(){a(b),c(b,n)})),_.forEach((function(e){return e.classList.add("popup_is-animated")})),function(e){document.querySelectorAll(e.formSelector).forEach((function(t){t.addEventListener("submit",(function(e){e.preventDefault()})),function(e,t){var r=Array.from(e.querySelectorAll(t.inputSelector)),n=e.querySelector(t.submitButtonSelector);r.forEach((function(c){c.addEventListener("input",(function(){!function(e,t,r){t.validity.patternMismatch?t.setCustomValidity(t.dataset.errorMessage):t.setCustomValidity(""),t.validity.valid?o(e,t,r):function(e,t,r,n){var o=e.querySelector(".".concat(t.id,"-error"));t.classList.add(n.inputErrorClass),o.classList.add(n.errorClass),o.textContent=r}(e,t,t.validationMessage,r)}(e,c,t),function(e,t,r){!function(e){return e.some((function(e){return!e.validity.valid}))}(e)?(t.disabled=!1,t.classList.remove(r.inactiveButtonClass)):(t.disabled=!0,t.classList.add(r.inactiveButtonClass))}(r,n,t)}))}))}(t,e),t.reset()}))}(n)})();