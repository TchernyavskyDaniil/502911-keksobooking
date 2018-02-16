'use strict';

(function () {
  /**
   * Describing pin params
   * @enum {number} PinImgParams
   */
  var PinImgParams = {
    WIDTH: 40,
    HEIGHT: 40,
    ARROW_HEIGHT: 20
  };

  /**
   * Creating a random location for pin
   * @param {Object} advert
   * @return {Node}
   */
  var renderPin = function (advert) {
    var pin = document.createElement('button');
    var img = document.createElement('img');

    pin.classList.add('map__pin');
    pin.style.left = advert.location.x + 'px';
    pin.style.top = advert.location.y - (PinImgParams.ARROW_HEIGHT + PinImgParams.HEIGHT) * 0.5 + 'px';

    img.src = advert.author.avatar;
    img.width = PinImgParams.WIDTH;
    img.height = PinImgParams.HEIGHT;
    img.draggable = false;

    pin.appendChild(img);

    pin.addEventListener('click', function () {
      window.card.create(advert);
    });

    return pin;
  };

  window.pin = {
    render: renderPin
  };
})();
