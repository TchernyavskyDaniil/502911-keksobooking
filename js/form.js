'use strict';

(function () {
  /**
   * Minimum price for each type of house
   * @enum {number}
   */
  var MinHousePrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  /**
   * Rooms for a certain number of guests
   * @type {string}
   */
  var roomsGuestDependencies = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  var form = document.querySelector('.notice__form');
  var addressField = form.querySelector('#address');
  var noticeFields = form.querySelectorAll('.form__element');
  var price = form.querySelector('#price');
  var selectHouse = form.querySelector('#type');
  var checkIn = form.querySelector('#timein');
  var checkOut = form.querySelector('#timeout');
  var rooms = form.querySelector('#room_number');
  var guests = form.querySelector('#capacity');
  var title = form.querySelector('#title');
  var submitButton = form.querySelector('.form__submit');
  var resetButton = form.querySelector('.form__reset');
  var arrInputError = [];

  var fillAddressField = function (x, y) {
    var buttonOffsetX = 'X: ' + x;
    var buttonOffsetY = 'Y: ' + y;

    addressField.value = buttonOffsetX + ', ' + buttonOffsetY;
  };

  noticeFields.forEach(function (field) {
    window.utils.setDisableField(field, true);
  });

  /**
   * Get min value for special selected house
   */
  var priceChangeHandler = function () {
    price.min = MinHousePrices[selectHouse.value];
    price.placeholder = price.min;
  };

  /**
   * Get customized error for a special incorrect input field 'amount per night'
   */
  var validatePrice = function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Цена не может быть ниже ' + price.min + ' рублей!');
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Цена не должна быть выше 1 000 000 рублей!');
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Вы забыли указать цену!');
    } else {
      price.setCustomValidity('');
    }
  };

  /**
   * Get customized error for a special incorrect input field 'title'
   */
  var validateTitle = function () {
    if (title.validity.valueMissing) {
      title.setCustomValidity('Вы забыли про заголовок!');
    } else if (title.validity.tooShort) {
      title.setCustomValidity('Заголовок должен содержать не менее 30 символов. Сейчас: ' + title.value.length);
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Длина заголовка не должна превышать 100 символов. Сейчас: ' + title.value.length);
    } else {
      title.setCustomValidity('');
    }
  };

  /**
   * Get customized error for a empty input field 'address'
   * @param {Object} evt
   */
  var validateAddress = function (evt) {
    if (addressField.value === '') {
      addressField.style.borderColor = 'red';
      evt.preventDefault();
    }
  };

  /**
   * Checking required fields for validity
   * @param {Object} evt
   */
  var formInvalidHandler = function (evt) {
    validatePrice();
    validateTitle();
    validateAddress(evt);
    evt.target.style.borderColor = 'red';
    arrInputError.push(evt.target);
  };

  /**
   * Clear border color and custom validity fields
   */
  var submitButtonClickHandler = function () {
    arrInputError.forEach(function (input) {
      input.style.borderColor = '';
      input.setCustomValidity('');
    });
  };

  /**
   * Synchronizing fields
   * @param {Node} firstNode
   * @param {Node} secondNode
   */
  var syncInputValues = function (firstNode, secondNode) {
    secondNode.value = firstNode.value;
  };

  /**
   * Change and disabled optional guests fields
   */
  var roomsChangeHandler = function () {
    var select = roomsGuestDependencies[rooms.value];
    guests.value = (rooms.value === '100') ? '0' : rooms.value;

    [].slice.call(guests.options).forEach(function (option) {
      option.disabled = !select.includes(option.value);
    });
  };

  /**
   * Clear all map and form settings
   * @param {Object} evt
   */
  var resetButtonClickHandler = function (evt) {
    evt.preventDefault();
    form.reset();
    initializeForm();

    window.deactivateMap();

    noticeFields.forEach(function (field) {
      window.utils.setDisableField(field, true);
    });

    window.card.close();
    resetButton.removeEventListener('click', resetButtonClickHandler);
  };

  /**
   * Binding initialize states of fields
   */
  var initializeForm = function () {
    priceChangeHandler();
    roomsChangeHandler();

    arrInputError.forEach(function (input) {
      input.style.borderColor = '';
    });

    subscribeToFormEvents();
  };

  /**
   * Binding listeners in one function
   */
  var subscribeToFormEvents = function () {
    selectHouse.addEventListener('change', priceChangeHandler);

    rooms.addEventListener('change', roomsChangeHandler);

    form.addEventListener('invalid', formInvalidHandler, true);

    checkIn.addEventListener('change', function () {
      syncInputValues(checkIn, checkOut);
    });

    checkOut.addEventListener('change', function () {
      syncInputValues(checkOut, checkIn);
    });

    submitButton.addEventListener('click', submitButtonClickHandler);

    resetButton.addEventListener('click', resetButtonClickHandler);
  };

  window.form = {
    initialize: initializeForm,
    fillAddress: fillAddressField
  };
})();
