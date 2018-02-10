'use strict';

(function () {

  /**
   * How much adverts we have
   * @const {number}
   */
  var AD_COUNT = 8;

  /**
   * @enum {number} KeyCodes
   */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

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

  /**
   * Description of parameters of the main pin
   * @enum {number} PinParams
   */
  var PinParams = {
    WIDTH: 40,
    HEIGHT: 44,
    ARROW_HEIGHT: 22
  };

  /**
   * Minimum price for each type of house
   * @enum {number}
   */
  var MinPricesHouse = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var form = document.querySelector('.notice__form');
  var noticeFields = form.querySelectorAll('.form__element');
  var addressField = form.querySelector('#address');
  var pinMain = mapPins.querySelector('.map__pin--main');
  var price = form.querySelector('#price');
  var selectHouse = form.querySelector('#type');
  var checkIn = form.querySelector('#timein');
  var checkOut = form.querySelector('#timeout');
  var rooms = form.querySelector('#room_number');
  var guests = form.querySelector('#capacity');
  var title = form.querySelector('#title');
  var resetButton = form.querySelector('.form__reset');

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
    pin.style.left = advert.location.x + 'px';
    pin.style.top = advert.location.y - (PinImgParams.ARROW_HEIGHT + PinImgParams.HEIGHT) * 0.5 + 'px';

    img.src = advert.author.avatar;
    img.width = PinImgParams.WIDTH;
    img.height = PinImgParams.HEIGHT;
    img.draggable = false;

    pin.appendChild(img);

    pin.addEventListener('click', function (evt) {
      pinClickHandler(evt, advert);
    });

    return pin;
  };

  var fillAdressField = function () {
    var buttonOffsetX = 'X: ' + (pinMain.offsetLeft - PinParams.WIDTH * 0.5);
    var buttonOffsetY = 'Y: ' + (pinMain.offsetTop + PinParams.HEIGHT * 0.5 + PinParams.ARROW_HEIGHT);

    addressField.value = buttonOffsetX + ', ' + buttonOffsetY;
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
    img.width = PinImgParams.WIDTH;
    img.height = PinImgParams.HEIGHT;

    li.appendChild(img);

    return li;
  };

  /**
   * Return random number between the interval min (inclusive) - max (inclusive)
   * @param {number} min - number opacity
   * @param {number} max - number opacity
   * @return {number} - random number
   */
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var adverts = generateAdArray(AD_COUNT);
  var fragment = createPins(adverts);
  var advertCard;

  /**
   * Get active map and form
   */
  var enableMap = function () {
    mapPins.appendChild(fragment);

    map.classList.remove('map--faded');
    form.classList.remove('notice__form--disabled');

    noticeFields.forEach(function (field) {
      setDisableField(field, false);
    });
  };

  /**
   * Enable or disable fields for users
   * @param {Node} field
   * @param {boolean} isDisabled
   */
  var setDisableField = function (field, isDisabled) {
    field.disabled = isDisabled;
  };

  /**
   * Render pop-up a certain pressed pin
   * @param {Object} evt
   * @param {Object} advert
   */
  var pinClickHandler = function (evt, advert) {
    closeAdvertCard();

    advertCard = createAdvertCard(advert);
    map.appendChild(advertCard);

    document.addEventListener('keydown', keydownEscapeHandler);
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

  /**
   * Get min value for special selected house
   */
  var getMinPrice = function () {
    price.min = MinPricesHouse[selectHouse.value];
    price.placeholder = price.min;
  };

  /**
   * Get customized error for a special incorrect input field 'amount per night'
   */
  var priceValidity = function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Цена не может быть ниже ' + price.min + ' рублей!');
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Цена не должна быть выше 1 000 000 рублей!');
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Вы забыли указать цену!');
    } else {
      price.setCustomValidity('');
    }
  };

  /**
   * Get customized error for a special incorrect input field 'title'
   */
  var titleValidity = function () {
    if (title.validity.valueMissing) {
      title.setCustomValidity('Вы забыли про заголовок!');
    } else if (title.validity.tooShort) {
      title.setCustomValidity('Заголовок должен содержать не менее 30 символов. Сейчас: ' + title.value.length);
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Длина заголовка не должна превышать 100 символов. Сейчас: ' + title.value.length);
    } else {
      title.setCustomValidity('');
    }
  };

  /**
   * Synchronize same fields, when user choosing one of two fields
   * @param {Node} firstValue
   * @param {Node} secondValue
   * @return {number}
   */
  var synchByValue = function (firstValue, secondValue) {
    var value = firstValue.value;
    secondValue.value = (value === '100') ? '0' : value;
    return secondValue.value;
  };

  /**
   * Disabled optional guests fields
   * @param {number} currentGuests - Get value of rooms
   */
  var disableOptionsGuests = function (currentGuests) {
    [].slice.call(guests.options).forEach(function (option) {
      if (currentGuests === 0) {
        option.disabled = (option.value !== currentGuests);
      } else {
        option.disabled = (option.value > currentGuests || option.value === '0');
      }
    });
  };

  /**
   * Binding initial states of fields
   */
  var initialForm = function () {
    getMinPrice();
    synchByValue(rooms, guests);
    disableOptionsGuests(synchByValue(rooms, guests));
    fillAdressField();
  };

  /**
   * Binding listeners in one function
   */
  var addListeners = function () {
    selectHouse.addEventListener('change', getMinPrice);

    checkIn.addEventListener('change', function () {
      synchByValue(checkIn, checkOut);
    });

    checkOut.addEventListener('change', function () {
      synchByValue(checkOut, checkIn);
    });

    rooms.addEventListener('change', function () {
      disableOptionsGuests(synchByValue(rooms, guests));
    });

    form.addEventListener('invalid', function (evt) {
      priceValidity();
      titleValidity();
      evt.target.style.borderColor = 'red';
    }, true);
  };

  initialForm();
  addListeners();
  fillAdressField();

  noticeFields.forEach(function (field) {
    setDisableField(field, true);
  });

  var pinMainMouseupHandler = function () {
    enableMap();
    fillAdressField();
    pinMain.removeEventListener('mouseup', pinMainMouseupHandler);
  };

  pinMain.addEventListener('mouseup', pinMainMouseupHandler);

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetButton.form.reset();
    initialForm();
  });
})();
