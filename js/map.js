'use strict';

(function () {
  /**
   * How much adverts we have
   * @const {number}
   */
  var AD_COUNT = 8;

  /**
   * Description of parameters of the main pin
   * @enum {number} MainPinParams
   */
  var MainPinParams = {
    WIDTH: 40,
    HEIGHT: 44,
    ARROW_HEIGHT: 22
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var form = document.querySelector('.notice__form');
  var noticeFields = form.querySelectorAll('.form__element');
  var pinMain = mapPins.querySelector('.map__pin--main');
  var resetButton = form.querySelector('.form__reset');
  var pins = [];

  var getX = function () {
    var offsetX = pinMain.offsetLeft - MainPinParams.WIDTH * 0.5;
    return offsetX;
  };

  var getY = function () {
    var offsetY = pinMain.offsetTop + MainPinParams.HEIGHT * 0.5 + MainPinParams.ARROW_HEIGHT;
    return offsetY;
  };

  /**
   * Fill array of ads
   * @return {Array}
   */
  var generateAdArray = function () {
    var adverts = [];

    for (var i = 0; i < AD_COUNT; i++) {
      adverts.push(window.generate(i));
    }

    return adverts;
  };

  /**
   * Return array of fragment pins
   * @param {Array} advertsArray
   * @return {Array}
   */
  var createPins = function (advertsArray) {
    var fragment = document.createDocumentFragment();

    advertsArray.forEach(function (item) {
      var node = window.render(item);
      fragment.appendChild(node);
      pins.push(node);
    });

    return fragment;
  };

  /**
   * Remove array of pins from map
   */
  var deletePins = function () {
    pins.forEach(function (pin) {
      mapPins.removeChild(pin);
    });
  };

  var fragment = createPins(generateAdArray());

  /**
   * Get active map and form
   */
  var enableMap = function () {
    mapPins.appendChild(fragment);

    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    window.form.fill(getX(), getY());

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

  /**
   * Clear all map and form settings
   * @param {Object} evt
   */
  var resetButtonClickHandler = function (evt) {
    evt.preventDefault();
    form.reset();
    window.form.initialize();
    window.form.fill(getX(), getY());

    map.classList.add('map--faded');
    form.classList.add('notice__form--disabled');

    noticeFields.forEach(function (field) {
      window.utils.setDisableField(field, true);
    });

    window.card.close();
    deletePins();

    pinMain.addEventListener('mouseup', pinMainMouseupHandler);
    resetButton.removeEventListener('click', resetButtonClickHandler);
  };

  resetButton.addEventListener('click', resetButtonClickHandler);

  pinMain.addEventListener('mouseup', pinMainMouseupHandler);
})();
