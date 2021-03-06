class Dom {

  /**
   * Public.
   * @param {Function} callback
   */
  static onReady (callback) {
    Dom.on(window, 'load', callback);
  }

  /**
   * Public.
   * @param {HTMLElement} el
   * @param {String} event
   * @param {Function} handler
   * @param {Boolean} useCapture Specify to use event bubbling or event capturing.
   */
  static on (el, event, handler, useCapture) {
    el.addEventListener(event, handler, useCapture);
  }

  /**
   * Public.
   * @param {HTMLElement} el
   * @param {String} event
   * @param {Function} handler
   */
  static un (el, event, handler) {
    el.removeEventListener(event, handler);
  }

  /**
   * Public.
   * @param {String} html
   */
  static create (html) {
    var div = document.createElement('div');

    div.innerHTML = html;
    return div.firstChild;
  }

  /**
   * Public.
   * @param {HTMLElement} container
   * @param {HTMLElement} element
   * @param {String} [position] 'before' or 'after'
   */
  static insert (container, element, position) {
    if (position) {
      container.parentNode.insertBefore(element, position === 'before' ? container : container.nextSibling);
    } else {
      container.appendChild(element);
    }
  }

  /**
   * Public.
   * @param {HTMLElement} container
   * @param {HTMLElement} element
   */
  static insertBefore (container, element) {
    container.parentNode.insertBefore(element, container);
  }

  /**
   * Public.
   * @param {HTMLElement} container
   * @param {HTMLElement} element
   */
  static insertAfter (container, element) {
    container.parentNode.insertBefore(element, container.nextSibling);
  }

  /**
   * Public.
   * Returns true if the container contains the element.
   * @param {HTMLElement} container
   * @param {HTMLElement} element
   */
  static contains (container, element) {
    return container.contains(element);
  }

  /**
   * Public.
   * @param {HTMLElement} element
   * @param {String} cls
   */
  static addCls (element, cls) {
    var split = cls.split(' ');

    if (split.length > 1) {
      split.forEach(function (item) {
        Dom.addCls(element, item);
      });

      return;
    }

    var cs = element.classList;

    if (!cs.contains(cls)) {
      cs.add(cls);
    }
  }

  /**
   * Public.
   * @param {HTMLElement} element
   * @param {String} cls
   */
  static removeCls (element, cls) {
    var split = cls.split(' ');

    if (split.length > 1) {
      split.forEach(function (item) {
        Dom.removeCls(element, item);
      });

      return;
    }

    var cs = element.classList;

    if (cs.contains(cls)) {
      cs.remove(cls);
    }
  }

  /**
   * Public.
   * @param {HTMLElement} element
   */
  static getBox (element) {
    return element.getBoundingClientRect();
  }

  /**
   * Public.
   */
  static getViewportSize () {
    var el = document.documentElement;
    return { height: el.clientHeight, width: el.clientWidth };
  }

  /**
   * Public.
   * @param {HTMLElement} element
   * @param {Number} [width]
   * @param {Number} [height]
   */
  static setSize (element, width, height) {
    var style = element.style;

    if (height) {
      style.height = height + 'px';
    }

    if (width) {
      style.width = width + 'px';
    }
  }

  /**
   * Public
   * @param {HTMLElement} element
   * @param {String/Object} key
   * @param {String} value (Optional)
   */
  static setStyle (element, key, value) {
    if (typeof key === 'object') {
      for (var prop in key) {
        element.style[prop] = key[prop];
      }
    } else {
      element.style[key] = value;
    }
  }

  /**
   * Public.
   * @param {HTMLElement} element
   * @param {String} key
   */
  static getStyle (element, key) {
    return element.style[key];
  }

  /**
   * From: github.com/james2doyle/saltjs
   * @param {String} selector
   * @param {HTMLElement} context
   * @returns HTMLCollection/HTMLElement
   *
   * @usage
  // get by id
  Dom.select('#iddiv');

  // get by class name
  Dom.select('.classdiv');

  // get by element name
  Dom.select('@namediv');

  // get by element tag name
  Dom.select('=div');

  // get element by query selector
  Dom.select('*div div.inside');

  // getAttribute of name
  Dom.select('#iddiv').getAttribute('name');

  // getAttribute of name from nodelist
  Dom.select('.classdiv')[0].getAttribute('name');
  */
  static select (selector, context) {
    // an object containing the matching keys and native get commands
    var matches = {
    '#': 'getElementById',
    '.': 'getElementsByClassName',
    '@': 'getElementsByName',
    '=': 'getElementsByTagName',
    '*': 'querySelectorAll'
    }[selector[0]]; // you can treat a string as an array of characters
    // now pass the selector without the key/first character
    var el = (((context === undefined) ? document : context)[matches](selector.slice(1)));
    // if there is one element than return the 0 element
    // return ((el.length < 2) ? el[0]: el);
    return el;
  }
}

// Dom.onReady(function () {
//   var body = document.getElementsByTagName('BODY')[0];
//   Dom.addCls(body, 'smp-' + Device.device());
// });