'use strict';

(function () {
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
   * Create ad object
   * @param {number} adIndex
   * @return {Object}
   */
  var generateAd = function (adIndex) {
    var locX = Math.floor(window.utils.getRandomNumber(adsParams.LOCATION_RANGE.MIN_X, adsParams.LOCATION_RANGE.MAX_X));
    var locY = Math.floor(window.utils.getRandomNumber(adsParams.LOCATION_RANGE.MIN_Y, adsParams.LOCATION_RANGE.MAX_Y));
    var objAds = {
      author: {
        avatar: getAvatar(adIndex + 1)
      },

      offer: {
        title: adsParams.TITLES[adIndex],
        address: locX + ', ' + locY,
        price: Math.floor(window.utils.getRandomNumber(adsParams.PRICE_RANGE.MIN, adsParams.PRICE_RANGE.MAX)),
        type: getHouseType(adsParams.TITLES[adIndex]),
        rooms: Math.floor(window.utils.getRandomNumber(adsParams.ROOMS_RANGE.MIN, adsParams.ROOMS_RANGE.MAX)),
        guests: Math.floor(window.utils.getRandomNumber(1, adsParams.MAX_GUESTS)),
        checkin: adsParams.CHECK_ITEMS[window.utils.getRandomNumber(0, adsParams.CHECK_ITEMS.length - 1).toFixed()],
        checkout: adsParams.CHECK_ITEMS[window.utils.getRandomNumber(0, adsParams.CHECK_ITEMS.length - 1).toFixed()],
        features: window.utils.getRandomArray(adsParams.FEATURES_ITEMS, Math.floor(window.utils.getRandomNumber(1, adsParams.FEATURES_ITEMS.length))),
        description: '',
        photos: window.utils.getShuffleArray(adsParams.PHOTOS_ITEMS)
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
   * @param {string} titleName
   * @return {string}
   */
  var getHouseType = function (titleName) {
    var indexTitle = 0;

    Object.keys(houseType).forEach(function (key) {
      if (RegExp(key).test(titleName.toLowerCase())) {
        indexTitle = houseType[key];
      }
    });

    return adsParams.TYPES[indexTitle];
  };

  window.data = {
    generate: generateAd
  };
})();
