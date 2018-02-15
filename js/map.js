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

  var adverts = window.data.generateAdArray(AD_COUNT);
  var fragment = window.pin.create(adverts);

  /**
   * Get active map and form
   */
  var enableMap = function () {
    mapPins.appendChild(fragment);

    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');

    noticeFields.forEach(function (field) {
      window.form.setDisableField(field, false);
    });
  };

  var pinMainMouseupHandler = function () {
    enableMap();
    pinMain.removeEventListener('mouseup', pinMainMouseupHandler);
  };

  pinMain.addEventListener('mouseup', pinMainMouseupHandler);
})();
