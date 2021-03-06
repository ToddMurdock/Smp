class Element {

  /**
   * @param {HTMLElement/String} html
   */
  constructor (html) {
    if (typeof html === 'string') {
      this.dom = Dom.create(html);
    }

    else {
      this.dom = html;
    }

    this._listeners = new Map();
  }

  /**
   * Public.
   * @param {String} html
   */
  update (html) {
    this.dom.innerHTML = html;
  }

  /**
   * Public.
   * @param {HTMLElement/Element} dom
   */
  appendChild (dom) {
    dom = dom instanceof Element ? dom.dom : dom;
    this.dom.appendChild(dom);
  }

  /**
   * Public.
   * @param {HTMLElement/Element} dom
   */
  removeChild (dom) {
    dom = dom instanceof Element ? dom.dom : dom;
    this.dom.removeChild(dom);
  }

  /**
   * Public.
   * @param {HTMLElement} dom
   */
  contains (dom) {
    return Dom.contains(this.dom, dom);
  }

  /**
   * Public.
   * @param {String} cls
   */
  addCls (cls) {
    Dom.addCls(this.dom, cls);
  }

  /**
   * Public.
   * @param {String} cls
   */
  removeCls (cls) {
    Dom.removeCls(this.dom, cls);
  }

  /**
   * Public
   * @param {Number} [width]
   * @param {Number} [height]
   */
  setSize (width, height) {
    Dom.setSize(this.dom, width, height);
  }

  /**
   * Public
   * @param {String/Object} key
   * @param {String} value (Optional)
   */
  setStyle (key, value) {
    Dom.setStyle(this.dom, key, value);
  }

  /**
   * Public
   * @param {String} key
   */
  getStyle (key) {
    return Dom.getStyle(this.dom, key);
  }

  /**
   * Public,
   */
  getBox () {
    return Dom.getBox(this.dom);
  }

  /**
   * Public.
   * @param {String} label
   * @param {Function} callback
   */
  on (label, callback) {
    Dom.on(this.dom, label, callback);
    this._listeners.has(label) || this._listeners.set(label, []);
    this._listeners.get(label).push(callback);
  }

  /**
   * Public.
   * @param {String} label
   * @param {Function} callback
   */
  un (label, callback) {
    var listeners = this._listeners.get(label),
        found, index;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        found = (typeof listener == 'function' && listener === callback);

        if (found) {
          Dom.un(this.dom, label, callback);
        }

        return found ? i = index : i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this._listeners.set(label, listeners);
        return true;
      }
    }

    return false;
  }

  clearListeners () {
    var me = this;

    me._listeners.forEach(function (callbackItems, label) {
      callbackItems.forEach(function (callback) {
        me.un(label, callback);
      });
    });

    me._listeners.clear();
  }

  destroy () {
    var me = this,
        dom = me.dom;

    me.clearListeners();

    if (dom === document || dom === document.body) {
      return;
    }

    parent = dom.parentNode;

    if (parent) {
      parent.removeChild(dom);
    }

    me.dom = undefined;
  }
}