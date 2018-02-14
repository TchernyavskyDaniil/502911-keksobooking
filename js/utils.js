'use strict';

(function () {
  /**
   * Return random number between the interval min (inclusive) - max (inclusive)
   * @param {number} min - number opacity
   * @param {number} max - number opacity
   * @return {number} - random number
   */
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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

  window.utils = {
    getRandomNumber: getRandomNumber,
    getRandomArray: getRandomArray,
    getShuffleArray: getShuffleArray
  };
})();
