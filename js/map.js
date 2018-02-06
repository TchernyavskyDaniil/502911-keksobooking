'use strict';

(function () {

  /**
   * How much adverts we have
   * @const {number}
   */
  var AD_COUNT = 8;

  /**
   * Nearby ads params
   * @type {Object}
   */
  var adsParams = {
    TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
      'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],

    PRICE_RANGE: {
      MIN: 1000,
      MAX: 1000000
    },

    TYPES: ['flat', 'house', 'bungalo'],

    ROOMS_RANGE: {
      MIN: 1,
      MAX: 5
    },

    MAX_GUESTS: 10,

    CHECK_ITEMS: ['12:00', '13:00', '14:00'],

    FEATURES_ITEMS: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],

    PHOTOS_ITEMS: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ],

    LOCATION_RANGE: {
      MIN_X: 300,
      MAX_X: 900,
      MIN_Y: 150,
      MAX_Y: 500
    }
  };

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
   * Dictionary for find type of house
   * @type {number}
   */
  var houseType = {
    'квартира': 0,
    'дворец': 1,
    'домик': 2,
    'бунгало': 2
  };

  /**
   * Describing pin params
   * @enum {number} PinImgParams
   */
  var PinImgParams = {
    WIDTH: 40,
    HEIGHT: 40,
    ARROW_HEIGHT: 20
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var mapFiltersContainter = document.querySelector('.map__filters-container');

  /**
   * Fill array of ads
   * @param {number} length
   * @return {Array}
   */
  var generateAdArray = function (length) {
    var adArr = [];
    for (var i = 0; i < length; i++) {
      adArr.push(generateAd(i));
    }

    return adArr;
  };

  /**
   * Create ad object
   * @param {number} adIndex
   * @return {Object}
   */
  var generateAd = function (adIndex) {
    var locX = Math.floor(getRandomNumber(adsParams.LOCATION_RANGE.MIN_X, adsParams.LOCATION_RANGE.MAX_X));
    var locY = Math.floor(getRandomNumber(adsParams.LOCATION_RANGE.MIN_Y, adsParams.LOCATION_RANGE.MAX_Y));
    var objAds = {
      author: {
        avatar: getAvatar(adIndex + 1)
      },

      offer: {
        title: adsParams.TITLES[adIndex],
        address: locX + ', ' + locY,
        price: Math.floor(getRandomNumber(adsParams.PRICE_RANGE.MIN, adsParams.PRICE_RANGE.MAX)),
        type: getHouseType(adsParams.TITLES[adIndex]),
        rooms: Math.floor(getRandomNumber(adsParams.ROOMS_RANGE.MIN, adsParams.ROOMS_RANGE.MAX)),
        guests: Math.floor(getRandomNumber(1, adsParams.MAX_GUESTS)),
        checkin: adsParams.CHECK_ITEMS[getRandomNumber(0, adsParams.CHECK_ITEMS.length - 1).toFixed()],
        checkout: adsParams.CHECK_ITEMS[getRandomNumber(0, adsParams.CHECK_ITEMS.length - 1).toFixed()],
        features: getRandomArray(adsParams.FEATURES_ITEMS, Math.floor(getRandomNumber(1, adsParams.FEATURES_ITEMS.length))),
        description: '',
        photos: getShuffleArray(adsParams.PHOTOS_ITEMS)
      },

      location: {
        x: locX,
        y: locY
      }
    };

    return objAds;
  };

  /**
   * Take a avatar index
   * @param {number} index
   * @return {string}
   */
  var getAvatar = function (index) {
    var pathAvatar = (index <= 9) ? 'img/avatars/user0' : 'img/avatars/user';
    return pathAvatar + index + '.png';
  };

  /**
   * Search a type of house by a specific word
   * @param {string} title
   * @return {string}
   */
  var getHouseType = function (title) {
    var indexTitle = 0;

    Object.keys(houseType).forEach(function (key) {
      if (RegExp(key).test(title.toLowerCase())) {
        indexTitle = houseType[key];
      }
    });

    return adsParams.TYPES[indexTitle];
  };

  /**
   * Get new array with unique elements from old.
   * Elements order in new array is random.
   * @param {Array} arr
   * @param {number} length
   * @return {Array}
   */
  var getRandomArray = function (arr, length) {
    var newArr = [];
    var rand;
    while (length > newArr.length) {
      var randomIndex = Math.floor(Math.random() * arr.length);
      rand = arr[randomIndex];
      if (~newArr.indexOf(rand)) {
        continue;
      } else {
        newArr.push(rand);
      }
    }

    return newArr;
  };

  /**
   * Shuffling array using algorithm the Fisher-Yates
   * @param {Array} array
   * @return {Array}
   */
  var getShuffleArray = function (array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
    pin.style.left = advert.location.x + PinImgParams.WIDTH / 2 + 'px';
    pin.style.top = advert.location.y - PinImgParams.HEIGHT - PinImgParams.ARROW_HEIGHT + 'px';

    img.src = advert.author.avatar;
    img.width = PinImgParams.WIDTH;
    img.height = PinImgParams.HEIGHT;
    img.draggable = false;

    pin.appendChild(img);

    return pin;
  };

  /**
   * Return array of fragment pins
   * @param {Array} advertsArray
   * @return {Array}
   */
  var createPins = function (advertsArray) {
    var fragment = document.createDocumentFragment();

    advertsArray.forEach(function (item) {
      fragment.appendChild(renderPin(item));
    });

    return fragment;
  };

  /**
   * Fill pop-up
   * @param {string} advert
   * @return {Node}
   */
  var createAdvert = function (advert) {
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
    getRenderImages(cardPhoto, advert.offer.photos);

    advert.offer.features.forEach(function (feature) {
      cardFeature.appendChild(getRenderElement(feature));
    });

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
   * Render new images
   * @param {Node} cardPhoto
   * @param {string} newPhotos
   */
  var getRenderImages = function (cardPhoto, newPhotos) {
    newPhotos.forEach(function (photos) {
      createPicture(cardPhoto, photos);
    });
  };

  /**
   * Render picture
   * @param {Node} cardPhoto
   * @param {string} photos
   */
  var createPicture = function (cardPhoto, photos) {
    var li = document.createElement('li');
    var img = document.createElement('img');

    img.src = photos;
    img.width = PinImgParams.WIDTH;
    img.height = PinImgParams.HEIGHT;

    cardPhoto.appendChild(li);
    li.appendChild(img);
  };

  /**
   * Return random number between the interval min (inclusive) - max (inclusive)
   * @param {number} min - number opacity
   * @param {number} max - number opacity
   * @return {number} - random number
   */
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  map.classList.remove('map--faded');
  mapPins.appendChild(createPins(generateAdArray(AD_COUNT)));
  map.insertBefore(createAdvert(generateAdArray(AD_COUNT)[0]), mapFiltersContainter);
})();
