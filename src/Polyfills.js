/**
 * Running the following code before any other code will create the functions if
 * not natively available.
 */

/**
 * Array.isArray()
 * If the object is an Array, true is returned, otherwise false is.
 * developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

/**
 * Object.assign();
 * developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}