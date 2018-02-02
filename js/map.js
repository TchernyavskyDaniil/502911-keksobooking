'use strict';

var AdParams = {
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

var PinImgParams = {
  WIDTH: 40,
  HEIGHT: 40
};

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var mapFiltersContainter = document.querySelector('.map__filters-container');

var generateAdArray = function () {
  var adArr = [];
  for (var i = 1; i < AdParams.AD_COUNT; i++) {
    adArr.push(generateAd(i));
  }
  return adArr;
};

var generateAd = function (adIndex) {
  var title = getTitle(adIndex);
  var locX = Math.floor(getRandomNumber(AdParams.LOCATIONS.MIN_X, AdParams.LOCATIONS.MAX_X));
  var locY = Math.floor(getRandomNumber(AdParams.LOCATIONS.MIN_Y, AdParams.LOCATIONS.MAX_Y));
  var price = Math.floor(getRandomNumber(AdParams.PRICES.MIN, AdParams.PRICES.MAX));
  var houseType = getHouseType(title);
  var rooms = Math.floor(getRandomNumber(AdParams.ROOMS_RANGE.MIN, AdParams.ROOMS_RANGE.MAX));
  var guests = Math.floor(getRandomNumber(1, AdParams.MAX_GUESTS));

  return {
    author: {
      avatar: getAvatar(adIndex)
    },

    offer: {
      title: title,
      address: locX + ', ' + locY,
      price: price,
      type: houseType,
      rooms: rooms,
      guests: guests,
      checkin: getCheckTime(AdParams.CHECK_ITEMS),
      checkout: getCheckTime(AdParams.CHECK_ITEMS),
      features: getFeatures(),
      description: '',
      photos: getPhotos()
    },

    location: {
      x: locX,
      y: locY
    }
  };
};

var getTitle = function (index) {
  return AdParams.TITLES[index];
};

var getAvatar = function (index) {
  var pathAvatar = 'img/avatars/user';
  var typeAvatar = '.png';
  pathAvatar = (index <= 8) ? pathAvatar + '0' : pathAvatar;
  var result = pathAvatar + index + typeAvatar;
  return result;
};

var getHouseType = function (title) {
  var indexTitle = 0;

  if (/квартира/.test(title.toLowerCase())) {
    indexTitle = 0;
  } else if (/дворец/.test(title.toLowerCase())) {
    indexTitle = 1;
  } else {
    indexTitle = 2;
  }

  return AdParams.TYPES[indexTitle];
};

var getCheckTime = function (arrTime) {
  return arrTime[getRandomNumber(0, arrTime.length - 1).toFixed()];
};

var getFeatures = function () {
  var newArr = [];
  var randomNumber = Math.floor(getRandomNumber(0, AdParams.FEATURES_ITEMS.length));
  var rand;

  for (var i = randomNumber; i >= 0; i--) {
    rand = AdParams.FEATURES_ITEMS[Math.floor(Math.random() * AdParams.FEATURES_ITEMS.length)];
    newArr[i] = rand;
  }

  return getUnique(newArr);
};

var getUnique = function (arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true;
  }

  return Object.keys(obj);
};

var getPhotos = function () {
  return AdParams.PHOTOS_ITEMS.sort(compareRandom);
};

var renderPin = function (advert) {
  var mapPin = document.createElement('button');
  var mapAvatar = document.createElement('img');

  mapPin.classList.add('map__pin');
  mapPin.style.left = advert.location.x + 'px';
  mapPin.style.top = advert.location.y + 'px';

  mapAvatar.src = advert.author.avatar;
  mapAvatar.width = PinImgParams.WIDTH;
  mapAvatar.height = PinImgParams.HEIGHT;
  mapAvatar.draggable = false;

  mapPin.appendChild(mapAvatar);

  return mapPin;
};

var createPins = function (advertsArray) {
  var pinsArray = [];

  advertsArray.forEach(function (item) {
    pinsArray.push(renderPin(item));
  });

  return pinsArray;
};

var generateDocumentFragment = function (arrPin) {
  var fragment = document.createDocumentFragment();

  arrPin.forEach(function (pin) {
    fragment.appendChild(pin);
  });

  return fragment;
};

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

var getRenderFeatures = function (cardFeatures, newFeatures) {
  while (cardFeatures.hasChildNodes()) {
    cardFeatures.removeChild(cardFeatures.lastChild);
  }

  newFeatures.forEach(function (feature) {
    var li = document.createElement('li');
    li.className = 'feature feature--' + feature;
    cardFeatures.appendChild(li);
  });

  return cardFeatures;
};

var getRenderImages = function (cardPhotos, newPhotos) {
  while (cardPhotos.hasChildNodes()) {
    cardPhotos.removeChild(cardPhotos.lastChild);
  }

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

var getRandomNumber = function (min, max) {
  return Math.random() * (max - min) + min;
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var adverts = generateAdArray();
var createPinsArray = createPins(adverts);
var documentFragment = generateDocumentFragment(createPinsArray);
var advertsFirst = createAdverts(adverts[0]);


map.classList.remove('map--faded');
mapPins.appendChild(documentFragment);
map.insertBefore(advertsFirst, mapFiltersContainter);
