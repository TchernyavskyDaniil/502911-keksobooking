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
  var pins = [];

  var offsetX = pinMain.offsetLeft - MainPinParams.WIDTH * 0.5;
  var primaryOffsetX = pinMain.offsetLeft;
  var offsetY = pinMain.offsetTop + MainPinParams.HEIGHT * 0.5 + MainPinParams.ARROW_HEIGHT;
  var primaryOffsetY = pinMain.offsetTop;

  /**
   * Fill array of ads
   * @return {Array}
   */
  var generateAdArray = function () {
    var adverts = [];

    for (var i = 0; i < AD_COUNT; i++) {
      adverts.push(window.generateAd(i));
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
      var node = window.renderPin(item);
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

  /**
   * Reset map to original state
   */
  var resetMap = function () {
    window.form.fillAddress(primaryOffsetX, primaryOffsetY);
    pinMain.style.left = primaryOffsetX + 'px';
    pinMain.style.top = primaryOffsetY + 'px';
    deletePins();
    map.classList.add('map--faded');
    form.classList.add('notice__form--disabled');
  };

  var fragment = createPins(generateAdArray());

  /**
   * Get active map and form
   */
  var enableMap = function () {
    mapPins.appendChild(fragment);

    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');
    window.form.fillAddress(offsetX, offsetY);

    noticeFields.forEach(function (field) {
      window.utils.setDisableField(field, false);
    });

    window.form.initialize();

    pins.forEach(function (pin) {
      mapPins.appendChild(pin);
    });
  };

  pinMain.addEventListener('mousedown', function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    pinMain.style.cursor = 'none';

    var pinMainMouseMoveHandler = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';

      offsetX = pinMain.offsetLeft - MainPinParams.WIDTH * 0.5;
      offsetY = pinMain.offsetTop + MainPinParams.HEIGHT * 0.5 + MainPinParams.ARROW_HEIGHT;

      window.form.fillAddress(offsetX, offsetY);
    };

    var pinMainMouseUpHandler = function () {
      enableMap();
      pinMain.style.cursor = 'move';

      document.removeEventListener('mousemove', pinMainMouseMoveHandler);
      document.removeEventListener('mouseup', pinMainMouseUpHandler);
    };

    document.addEventListener('mousemove', pinMainMouseMoveHandler);
    document.addEventListener('mouseup', pinMainMouseUpHandler);
  });

  window.resetMap = resetMap;
})();
