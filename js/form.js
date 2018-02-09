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

  var setMinPrice = function () {
    price.min = MinPricesHouse[selectHouse.value];
    price.placeholder = price.min;
  };

  var synchByValue = function (checkOne, checkTwo) {
    var value = checkOne.value;
    checkTwo.value = (value === '100') ? '0' : value;
    return checkTwo.value;
  };

  var disableOptionsGuests = function (currentGuests) {
    [].slice.call(guests.options).forEach(function (option) {
      if (option.value === '0') {
        option.disabled = currentGuests;
      }
    });
  };

  selectHouse.addEventListener('change', setMinPrice);

  checkIn.addEventListener('change', function () {
    synchByValue(checkIn, checkOut);
  });

  checkOut.addEventListener('change', function () {
    synchByValue(checkOut, checkIn);
  });

  rooms.addEventListener('change', function () {
    disableOptionsGuests(synchByValue(rooms, guests));
  });
})();

