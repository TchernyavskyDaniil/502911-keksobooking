'use strict';

(function () {
  /**
   * Amount of adverts
   * @const {number}
   */
  var AD_COUNT = 8;

  /**
   * Parameters of the main pin
   * @enum {number} MainPinParams
   */
  var MainPinParams = {
    WIDTH: 64,
    HEIGHT: 64,
    ARROW_HEIGHT: 17
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var form = document.querySelector('.notice__form');
  var noticeFields = form.querySelectorAll('.form__element');
  var pinMain = mapPins.querySelector('.map__pin--main');
  var pins = [];
  var mainPinHeight = MainPinParams.HEIGHT * 0.5 + MainPinParams.ARROW_HEIGHT;
  var pageActivated = false;

  /**
   * Map boundaries
   * @enum {number} PinConstrains
   */
  var PinConstrains = {
    TOP: 500 - mainPinHeight,
    BOTTOM: 150 - mainPinHeight,
    LEFT: 0,
    RIGHT: map.clientWidth
  };

  var offsetX = pinMain.offsetLeft;
  var offsetY = pinMain.offsetTop + mainPinHeight;

  var primaryOffsetX = offsetX;
  var primaryOffsetY = pinMain.offsetTop;

  window.form.fillAddress(offsetX, offsetY);

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
   * Return fragment with pins
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
   * Remove array of pins from the map
   */
  var deletePins = function () {
    pins.forEach(function (pin) {
      mapPins.removeChild(pin);
    });
  };

  /**
   * Reset map to initial state
   */
  var deactivateMap = function () {
    pageActivated = false;
    pinMain.style.left = primaryOffsetX + 'px';
    pinMain.style.top = primaryOffsetY + 'px';
    deletePins();
    map.classList.add('map--faded');
    form.classList.add('notice__form--disabled');
    window.form.fillAddress(primaryOffsetX, primaryOffsetY + mainPinHeight);
    offsetX = primaryOffsetX;
    offsetY = primaryOffsetY + mainPinHeight;
  };

  var fragment = createPins(generateAdArray());

  /**
   * Activate the map and the form
   */
  var activateMap = function () {
    pageActivated = true;
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

    /**
     * Controls the action of 'drag' the main pin of the map
     * Movement of  pin is tied to the cursor
     * @param {Event} moveEvt
     */
    var pinMainMouseMoveHandler = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var currentCoords = {
        x: pinMain.offsetLeft - shift.x,
        y: pinMain.offsetTop - shift.y
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (currentCoords.y > PinConstrains.TOP) {
        currentCoords.y = PinConstrains.TOP;
      }

      if (currentCoords.y < PinConstrains.BOTTOM) {
        currentCoords.y = PinConstrains.BOTTOM;
      }

      if (currentCoords.x < PinConstrains.LEFT) {
        currentCoords.x = PinConstrains.LEFT;
      }

      if (currentCoords.x > PinConstrains.RIGHT) {
        currentCoords.x = PinConstrains.RIGHT;
      }

      pinMain.style.top = currentCoords.y + 'px';
      pinMain.style.left = currentCoords.x + 'px';

      offsetX = pinMain.offsetLeft;
      offsetY = pinMain.offsetTop + mainPinHeight;

      window.form.fillAddress(offsetX, offsetY);
    };

    var pinMainMouseUpHandler = function () {
      if (!pageActivated) {
        activateMap();
      }
      pinMain.style.cursor = 'move';

      document.removeEventListener('mousemove', pinMainMouseMoveHandler);
      document.removeEventListener('mouseup', pinMainMouseUpHandler);
    };

    document.addEventListener('mousemove', pinMainMouseMoveHandler);
    document.addEventListener('mouseup', pinMainMouseUpHandler);
  });

  window.deactivateMap = deactivateMap;
})();
