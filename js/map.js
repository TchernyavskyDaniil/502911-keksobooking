'use strict';

(function () {
  /**
   * How much adverts we have
   * @const {number}
   */
  var AD_COUNT = 8;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var form = document.querySelector('.notice__form');
  var noticeFields = form.querySelectorAll('.form__element');
  var pinMain = mapPins.querySelector('.map__pin--main');
  var pins = [];

  /**
   * Return array of fragment pins
   * @param {Array} advertsArray
   * @return {Array}
   */
  var createPins = function (advertsArray) {
    var fragment = document.createDocumentFragment();

    advertsArray.forEach(function (item) {
      var node = window.pin.render(item);
      fragment.appendChild(node);
      pins.push(node);
    });

    return fragment;
  };

  var adverts = window.data.generateAdArray(AD_COUNT);
  var fragment = createPins(adverts);

  /**
   * Get active map and form
   */
  var enableMap = function () {
    mapPins.appendChild(fragment);

    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');

    noticeFields.forEach(function (field) {
      window.utils.setDisableField(field, false);
    });

    window.form.initialize();

    pins.forEach(function (pin) {
      mapPins.appendChild(pin);
    });
  };

  var pinMainMouseupHandler = function () {
    enableMap();
    pinMain.removeEventListener('mouseup', pinMainMouseupHandler);
  };

  pinMain.addEventListener('mouseup', pinMainMouseupHandler);

  window.map = {
    pins: pins,
    pin: pinMainMouseupHandler
  };
})();
