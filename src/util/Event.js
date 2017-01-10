/**
 * datchley.name/es6-eventemitter/
 */
class Event {
  constructor () {
    this._listeners = new Map();
  }

  /**
   * Public.
   * @param {String} label
   * @param {Function} callback
   */
  on (label, callback) {
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
        index;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        return (typeof listener == 'function' && listener === callback) ? i = index : i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this._listeners.set(label, listeners);
        return true;
      }
    }

    return false;
  }

  /**
   * Public.
   * @param {String} label
   * @param {spread/rest} args
   */
  emit (label, ...args) {  
    var listeners = this._listeners.get(label);

    if (listeners && listeners.length) {
      listeners.forEach((listener) => {
        listener(...args); 
      });

      return true;
    }

    return false;
  }

  destroy () {
    var me = this;

    me._listeners.forEach(function (callbackItems, label) {
      callbackItems.forEach(function (callback) {
        me.un(label, callback);
      });
    });

    this._listeners.clear();
  }
}