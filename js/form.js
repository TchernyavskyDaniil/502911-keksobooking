'use strict';

(function () {
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

  var typeSelectHandler = function () {
    price.min = MinPricesHouse[selectHouse.value];
    price.placeholder = price.min;
  };

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

  var synchByValue = function (checkOne, checkTwo) {
    var value = checkOne.value;
    checkTwo.value = (value === '100') ? '0' : value;
    return checkTwo.value;
  };

  var disableOptionsGuests = function (currentGuests) {
    [].slice.call(guests.options).forEach(function (option) {
      if (currentGuests === '0') {
        option.disabled = (option.value !== currentGuests);
      } else {
        option.disabled = (option.value > currentGuests || option.value === '0');
      }
    });
  };

  var initialForm = function () {
    typeSelectHandler();
    synchByValue(rooms, guests);
    disableOptionsGuests(synchByValue(rooms, guests));
  };
  var addListeners = function () {
    selectHouse.addEventListener('change', typeSelectHandler);

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

