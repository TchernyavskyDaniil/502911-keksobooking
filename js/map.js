'use strict';

/**
 * Minimum value
 * @const {number} MIN_RANGE
 */
var MIN_RANGE = 1;

/**
 * Describing ads nearby
 * @type {object}
 */
var AdsParams = {
  AD_COUNT: 8,

  TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
    'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],

  PRICES: {
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

  LOCATIONS: {
    MIN_X: 300,
    MAX_X: 900,
    MIN_Y: 150,
    MAX_Y: 500
  }
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
  for (var i = 1; i < length; i++) {
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
  var locX = Math.floor(getRandomNumber(AdsParams.LOCATIONS.MIN_X, AdsParams.LOCATIONS.MAX_X));
  var locY = Math.floor(getRandomNumber(AdsParams.LOCATIONS.MIN_Y, AdsParams.LOCATIONS.MAX_Y));
  var objAds = {
    author: {
      avatar: getAvatar(adIndex)
    },

    offer: {
      title: AdsParams.TITLES[adIndex],
      address: locX + ', ' + locY,
      price: Math.floor(getRandomNumber(AdsParams.PRICES.MIN, AdsParams.PRICES.MAX)),
      type: getHouseType(AdsParams.TITLES[adIndex]),
      rooms: Math.floor(getRandomNumber(AdsParams.ROOMS_RANGE.MIN, AdsParams.ROOMS_RANGE.MAX)),
      guests: Math.floor(getRandomNumber(MIN_RANGE, AdsParams.MAX_GUESTS)),
      checkin: AdsParams.CHECK_ITEMS[getRandomNumber(MIN_RANGE - 1, AdsParams.CHECK_ITEMS.length - 1).toFixed()],
      checkout: AdsParams.CHECK_ITEMS[getRandomNumber(MIN_RANGE - 1, AdsParams.CHECK_ITEMS.length - 1).toFixed()],
      features: getProperties(AdsParams.FEATURES_ITEMS, Math.floor(getRandomNumber(MIN_RANGE, AdsParams.FEATURES_ITEMS.length))),
      description: '',
      photos: getPhotos(AdsParams.PHOTOS_ITEMS)
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
  var pathAvatar = (index <= 9) ? 'img/avatars/user' + '0' : 'img/avatars/user';
  return pathAvatar + index + '.png';
};

/**
 * Search a type of house by a specific word
 * @param {string} title
 * @return {string}
 */
var getHouseType = function (title) {
  var indexTitle = 0;

  if (/квартира/.test(title.toLowerCase())) {
    indexTitle = 0;
  } else if (/дворец/.test(title.toLowerCase())) {
    indexTitle = 1;
  } else {
    indexTitle = 2;
  }

  return AdsParams.TYPES[indexTitle];
};

/**
 * Return random features items
 * @param {string[]} arr
 * @param {number} length
 * @return {string[]}
 */
var getProperties = function (arr, length) {
  var copyArr = arr.slice();
  var newArr = [];
  var rand;

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * copyArr.length);
    rand = copyArr[randomIndex];
    newArr[i] = rand;
    delete copyArr[randomIndex];
    copyArr = copyArr.filter(function (e) {
      return e;
    });
  }

  return newArr;
};

/**
 * Return array in random order
 * @param {string[]} photos
 * @return {string[]}
 */
var getPhotos = function (photos) {
  return photos.sort(compareRandom);
};

/**
 * Creating a random location for pin
 * @param {Object} advert
 * @return {HTMLButtonElement}
 */
var renderPin = function (advert) {
  var mapPin = document.createElement('button');
  var mapAvatar = document.createElement('img');

  mapPin.classList.add('map__pin');
  mapPin.style.left = advert.location.x + PinImgParams.WIDTH / 2 + 'px';
  mapPin.style.top = advert.location.y - PinImgParams.HEIGHT - PinImgParams.ARROW_HEIGHT + 'px';

  mapAvatar.src = advert.author.avatar;
  mapAvatar.width = PinImgParams.WIDTH;
  mapAvatar.height = PinImgParams.HEIGHT;
  mapAvatar.draggable = false;

  mapPin.appendChild(mapAvatar);

  return mapPin;
};

/**
 * Return array of pins
 * @param {string[]} advertsArray
 * @return {Array}
 */
var createPins = function (advertsArray) {
  var pinsArray = [];

  advertsArray.forEach(function (item) {
    pinsArray.push(renderPin(item));
  });

  return pinsArray;
};

/**
 * Take and fill our array of pins in document fragment
 * @param {string[]} arrPin
 * @return {DocumentFragment}
 */
var generateDocumentFragment = function (arrPin) {
  var fragment = document.createDocumentFragment();

  arrPin.forEach(function (pin) {
    fragment.appendChild(pin);
  });

  return fragment;
};

/**
 * Fill pop-up
 * @param {string} advert
 * @return {Node}
 */
var createAdverts = function (advert) {
  var cardAdvert = mapCardTemplate.cloneNode(true);

  var cardTitle = cardAdvert.querySelector('h3');
  var cardAddress = cardAdvert.querySelector('small');
  var cardPrice = cardAdvert.querySelector('.popup__price');
  var cardHouse = cardAdvert.querySelector('h4');
  var cardRooms = cardAdvert.querySelector('.popup__room');
  var cardCheck = cardAdvert.querySelector('.popup__check');
  var cardFeatures = cardAdvert.querySelector('.popup__features');
  var cardDescription = cardAdvert.querySelector('.popup__description');
  var cardAvatar = cardAdvert.querySelector('.popup__avatar');
  var cardPhotos = cardAdvert.querySelector('.popup__pictures');

  cardTitle.textContent = advert.offer.title;
  cardAddress.textContent = advert.offer.address;
  cardPrice.textContent = advert.offer.price + '\t\u20BD/ночь';
  cardHouse.textContent = getTranslate(advert.offer.type);
  cardRooms.textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  cardCheck.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  getRenderFeatures(cardFeatures, advert.offer.features);
  cardDescription.textContent = advert.offer.description;
  cardAvatar.src = advert.author.avatar;
  getRenderImages(cardPhotos, advert.offer.photos);

  return cardAdvert;
};

/**
 * Return type of house
 * @param {string} advert
 * @return {string}
 */
var getTranslate = function (advert) {
  if (advert === 'flat') {
    advert = 'Квартира';
  } else if (advert === 'house') {
    advert = 'Бунгало';
  } else {
    advert = 'Дом';
  }

  return advert;
};

/**
 * Get clean node
 * @param {Node} node
 */
var getRemoveChildNode = function (node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
};

/**
 * Render new lists features
 * @param {Node} cardFeatures
 * @param {string} newFeatures
 * @return {Node}
 */
var getRenderFeatures = function (cardFeatures, newFeatures) {
  getRemoveChildNode(cardFeatures);

  newFeatures.forEach(function (feature) {
    var li = document.createElement('li');
    li.className = 'feature feature--' + feature;
    cardFeatures.appendChild(li);
  });

  return cardFeatures;
};

/**
 * Render new images
 * @param {Node} cardPhotos
 * @param {string} newPhotos
 * @return {Node}
 */
var getRenderImages = function (cardPhotos, newPhotos) {
  getRemoveChildNode(cardPhotos);

  newPhotos.forEach(function (photos) {
    var li = document.createElement('li');
    var img = document.createElement('img');

    img.src = photos;
    img.width = PinImgParams.WIDTH;
    img.height = PinImgParams.HEIGHT;

    cardPhotos.appendChild(li);
    li.appendChild(img);
  });

  return cardPhotos;
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

/**
 * Return random value 50%/50%
 * @return {number}
 */
var compareRandom = function () {
  return Math.random() - 0.5;
};

var adverts = generateAdArray(AdsParams.AD_COUNT);
var createPinsArray = createPins(adverts);
var documentFragment = generateDocumentFragment(createPinsArray);
var advertsFirst = createAdverts(adverts[0]);

map.classList.remove('map--faded');
mapPins.appendChild(documentFragment);
map.insertBefore(advertsFirst, mapFiltersContainter);
