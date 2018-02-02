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

  FEATURES_ITEMS: ['wifi', 'dishwater', 'parking', 'washer', 'elevator', 'conditioner'],

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

var map = document.querySelector('.map');

var generateAdArray = function () {
  var adArr = [];
  for (var i = 0; i < AdParams.AD_COUNT; i++) {
    adArr.push(generateAd());
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
  var check = getCheckTime(AdParams.CHECK_ITEMS);

  return {
    author: {
      avatar: getAvatar(adIndex)
    },

    offer: {
      title: title,
      address: locX + ' ' + locY,
      price: price,
      type: houseType,
      rooms: rooms,
      guests: guests,
      checkin: check,
      checkout: check,
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

  return pathAvatar + index + typeAvatar;
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
  var indexRandom = Math.floor(getRandomNumber(0, AdParams.FEATURES_ITEMS.length));
  for (var i = indexRandom; i >= 0; i--) {
    newArr[i] = AdParams.FEATURES_ITEMS[i];
  }
  return newArr.sort(compareRandom);
};

var getPhotos = function () {
  return AdParams.PHOTOS_ITEMS.sort(compareRandom);
};

var getRandomNumber = function (min, max) {
  return Math.random() * (max - min) + min;
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

map.classList.remove('map--faded');
