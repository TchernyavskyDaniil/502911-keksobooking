'use strict';

(function () {
  /**
   * Minimum price for each type of house
   * @enum {number}
   */
  var MinPricesHouse = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var form = document.querySelector('.notice__form');
  var price = form.querySelector('#price');
  var selectHouse = form.querySelector('#type');
  var checkIn = form.querySelector('#timein');
  var checkOut = form.querySelector('#timeout');
  var rooms = form.querySelector('#room_number');
  var guests = form.querySelector('#capacity');
  var title = form.querySelector('#title');

  /**
   * Get min value for special selected house
   */
  var getMinPrice = function () {
    price.min = MinPricesHouse[selectHouse.value];
    price.placeholder = price.min;
  };

  /**
   * Get customized error for a special incorrect input field 'amount per night'
   */
  var priceValidity = function () {
    var message;
    if (price.validity.rangeUnderflow) {
      message = 'Цена не может быть ниже ' + price.min + ' рублей!';
      price.setCustomValidity(message);
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
  var titleValidity = function () {
    var message;
    if (title.validity.valueMissing) {
      message = 'Вы забыли про заголовок!';
      title.setCustomValidity(message);
    } else if (title.validity.tooShort) {
      message = 'Заголовок должен содержать не менее 30 символов. Сейчас: ' + title.value.length;
      title.setCustomValidity(message);
    } else if (title.validity.tooLong) {
      message = 'Длина заголовка не должна превышать 100 символов. Сейчас: ' + title.value.length;
      title.setCustomValidity(message);
    } else {
      title.setCustomValidity('');
    }
  };

  /**
   * Synchronize same fields, when user choosing one of two fields
   * @param {Node} firstValue
   * @param {Node} secondValue
   * @return {number}
   */
  var synchByValue = function (firstValue, secondValue) {
    var value = firstValue.value;
    secondValue.value = (value === '100') ? '0' : value;
    return secondValue.value;
  };

  /**
   * Disabled optional guests fields
   * @param {number} currentGuests - Get value of rooms
   */
  var disableOptionsGuests = function (currentGuests) {
    [].slice.call(guests.options).forEach(function (option) {
      if (currentGuests === '0') {
        option.disabled = (option.value !== currentGuests);
      } else {
        option.disabled = (option.value > currentGuests || option.value === '0');
      }
    });
  };

  /**
   * Binding initial states of fields
   */
  var initialForm = function () {
    getMinPrice();
    synchByValue(rooms, guests);
    disableOptionsGuests(synchByValue(rooms, guests));
  };

  /**
   * Binding listeners in one function
   */
  var addListeners = function () {
    selectHouse.addEventListener('change', getMinPrice);

    checkIn.addEventListener('change', function () {
      synchByValue(checkIn, checkOut);
    });

    checkOut.addEventListener('change', function () {
      synchByValue(checkOut, checkIn);
    });

    rooms.addEventListener('change', function () {
      disableOptionsGuests(synchByValue(rooms, guests));
    });

    form.addEventListener('invalid', function (evt) {
      priceValidity();
      titleValidity();
      evt.target.style.borderColor = 'red';
    }, true);
  };

  initialForm();
  addListeners();
})();

