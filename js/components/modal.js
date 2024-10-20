const Modal = (() => {
  const modal = document.getElementById('modalForm');
  const closeButton = modal.querySelector('.modal__close');
  const form = modal.querySelector('.modal__form');
  const inputs = form.querySelectorAll('.modal__input');
  const submitButton = form.querySelector('.button--modal');
  const phoneInput = modal.querySelector('#phone');
  const nameInput = modal.querySelector('#name');
  const checkbox = modal.querySelector('.modal__consent-checkbox'); // Чекбокс
  const checkboxLabel = modal.querySelector('.modal__consent-label'); // Лейбл для чекбокса

  const open = () => {
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  };

  // Маска для телефона с поддержкой +7 и ограничение на 11 цифр
  const applyPhoneMask = () => {
    phoneInput.addEventListener('input', function (e) {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (x && x[0].length <= 11) { // Ограничиваем ввод до 11 цифр
        e.target.value = x[1] ? `+7 (${x[2]}` + (x[3] ? `) ${x[3]}` : '') + (x[4] ? `-${x[4]}` : '') : '';
      }
    });
  };

  // Функция для отображения или удаления ошибок
  const displayError = (input, message) => {
    const parent = input.parentElement;
    let errorMessage = parent.querySelector('.error-message');

    if (message) { // Если есть сообщение, показываем ошибку
      input.style.border = '1px solid red';
      if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        parent.appendChild(errorMessage);
      } else {
        errorMessage.textContent = message; // Обновляем текст ошибки, если сообщение уже есть
      }
    } else { // Убираем ошибку, если она исправлена
      input.style.border = '1px solid rgba(0, 0, 0, 0.1)';
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  };

  // Функция для очистки всех ошибок и стилей полей после сброса формы
  const clearErrors = () => {
    inputs.forEach(input => {
      input.style.border = '1px solid rgba(0, 0, 0, 0.1)'; // Сброс границ полей
      const parent = input.parentElement;
      const errorMessage = parent.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove(); // Удаление всех сообщений об ошибке
      }
    });

    // Удаление ошибки для чекбокса
    const checkboxError = checkboxLabel.parentElement.querySelector('.error-message');
    if (checkboxError) {
      checkboxError.remove();
    }

    // Возвращаем исходный вид кнопки
    submitButton.style.backgroundColor = 'rgba(144, 238, 144, 0.5)';
    submitButton.disabled = true;
  };

  // Валидация формы
  const validateForm = () => {
    let isValid = true;

    // Валидация имени
    const namePattern = /^[a-zA-Zа-яА-ЯёЁ]+$/; // Только буквы
    if (!nameInput.value.trim()) {
      displayError(nameInput, 'Имя не может быть пустым');
      isValid = false;
    } else if (!namePattern.test(nameInput.value)) {
      displayError(nameInput, 'Имя не должно содержать цифры или пробелы');
      isValid = false;
    } else {
      displayError(nameInput, null);
    }

    // Валидация телефона
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (!phoneInput.value.trim()) {
      displayError(phoneInput, 'Телефон не может быть пустым');
      isValid = false;
    } else if (phoneDigits.length < 11) {
      displayError(phoneInput, 'Телефон должен содержать 11 цифр');
      isValid = false;
    } else {
      displayError(phoneInput, null);
    }

    // Валидация чекбокса
    let checkboxError = checkboxLabel.parentElement.querySelector('.error-message');
    if (!checkbox.checked) {
      if (!checkboxError) {
        checkboxError = document.createElement('span');
        checkboxError.classList.add('error-message');
        checkboxError.textContent = 'Необходимо согласие на обработку данных';
        checkboxLabel.parentElement.appendChild(checkboxError); // Добавляем сообщение под лейблом
      }
      isValid = false;
    } else {
      if (checkboxError) {
        checkboxError.remove(); // Убираем сообщение, если чекбокс отмечен
      }
    }

    // Изменение состояния кнопки отправки
    submitButton.disabled = !isValid;
    submitButton.style.backgroundColor = isValid ? '#18c576' : 'rgba(144, 238, 144, 0.5)';

    return isValid;
  };

  const addEventListeners = () => {
    closeButton.addEventListener('click', close);

    inputs.forEach(input => {
      input.addEventListener('input', validateForm);
    });

    checkbox.addEventListener('change', validateForm); // Проверка чекбокса при изменении

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        // Собираем данные для отправки
        const formData = new FormData(form);

        // Отправка данных на сервер через fetch
        fetch('mail.php', {
          method: 'POST',
          body: formData
        })
          .then(response => response.text())
          .then(result => {
            if (result === 'success') {
              alert('Форма успешно отправлена!');
              form.reset();
              clearErrors(); 
            } else {
              alert('Ошибка при отправке формы: ' + result);
            }
          })
          .catch(error => {
            alert('Ошибка при отправке формы: ' + error);
          });
      }
    });
  };

  const init = () => {
    addEventListeners();
    applyPhoneMask();
  };

  return {
    open,
    close,
    init
  };
})();

export default Modal;
