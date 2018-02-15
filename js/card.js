'use strict';

(function () {
  /**
   * Translate property type in Russian
   * @type {string}
   */
  var propertyType = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  /**
   * Describing of card image parameters
   * @enum {number} ImgCardParams
   */
  var ImgCardParams = {
    WIDTH: 50,
    HEIGHT: 50
  };

  /**
   * @enum {number} KeyCodes
   */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  var advertCard;
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var map = document.querySelector('.map');

  /**
   * Fill pop-up
   * @param {string} advert
   * @return {Node}
   */
  var createAdvertCard = function (advert) {
    var cardAdvert = mapCardTemplate.cloneNode(true);

    var cardTitle = cardAdvert.querySelector('h3');
    var cardAddress = cardAdvert.querySelector('small');
    var cardPrice = cardAdvert.querySelector('.popup__price');
    var cardHouse = cardAdvert.querySelector('h4');
    var cardRoom = cardAdvert.querySelector('.popup__room');
    var cardCheck = cardAdvert.querySelector('.popup__check');
    var cardFeature = cardAdvert.querySelector('.popup__features');
    var cardDescription = cardAdvert.querySelector('.popup__description');
    var cardAvatar = cardAdvert.querySelector('.popup__avatar');
    var cardPhoto = cardAdvert.querySelector('.popup__pictures');

    cardTitle.textContent = advert.offer.title;
    cardAddress.textContent = advert.offer.address;
    cardPrice.textContent = advert.offer.price + '\t\u20BD/ночь';
    cardHouse.textContent = propertyType[advert.offer.type];
    cardRoom.textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
    cardCheck.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
    cardDescription.textContent = advert.offer.description;
    cardAvatar.src = advert.author.avatar;

    advert.offer.photos.forEach(function (photo) {
      cardPhoto.appendChild(createPicture(photo));
    });

    advert.offer.features.forEach(function (feature) {
      cardFeature.appendChild(getRenderElement(feature));
    });

    cardAdvert.querySelector('.popup__close').addEventListener('click', closeAdvertCard);

    return cardAdvert;
  };

  /**
   * Get new li with class
   * @param {string} className
   * @return {Node}
   */
  var getRenderElement = function (className) {
    var li = document.createElement('li');
    li.className = 'feature feature--' + className;
    return li;
  };

  /**
   * Render picture
   * @param {string} photoUrl
   * @return {Node}
   */
  var createPicture = function (photoUrl) {
    var li = document.createElement('li');
    var img = document.createElement('img');

    img.src = photoUrl;
    img.width = ImgCardParams.WIDTH;
    img.height = ImgCardParams.HEIGHT;

    li.appendChild(img);

    return li;
  };

  /**
   * Create a card on map
   * @param {Object} advert
   */
  var createCard = function (advert) {
    advertCard = createAdvertCard(advert);
    map.appendChild(advertCard);
  };

  /**
   * Check for a specific (ESC) button click
   * @param {Object} evt
   */
  var keydownEscapeHandler = function (evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      closeAdvertCard();
    }
  };

  /**
   * Close current pop-up
   */
  var closeAdvertCard = function () {
    if (advertCard) {
      map.removeChild(advertCard);
      advertCard = null;

      document.removeEventListener('keydown', keydownEscapeHandler);
    }
  };

  window.card = {
    closeAdvertCard: closeAdvertCard,
    keydownEscapeHandler: keydownEscapeHandler,
    createCard: createCard
  };
})();
