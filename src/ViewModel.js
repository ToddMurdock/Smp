class ViewModel {

  /**
   * CONFIG
   * data
   */

  constructor (config) {
    this._setConfig(config);
    this._event = new Event();
  }

  /**
   * Private.
   */
  _setConfig (config) {
    if (config) {
      this._config = config;

      for (let key in config) {
        this['_' + key] = config[key];
      }
    }
  }

  /**
   * Public.
   */
  getData () {
    return this._data;
  }

  /**
   * Public.
   * @param {Component} view
   */
  setView (view) {
    this._view = view;
  }

  /**
   * Public.
   */
  getView () {
    return this._view;
  }

  /**
   * Public.
   * @param {ViewController} viewController
   */
  setViewController (viewController) {
    this._viewController = viewController;
  }

  /**
   * Public.
   */
  getViewController () {
    return this._viewController;
  }

  /**
   * Public
   * @param {String} key
   * @param {Mixed} value
   */
  set (key, value) {
    let oldValue = this['_' + key];

    if (value !== oldValue) {
      this['_' + key] = value;
      this._publish(key, value, oldValue);
    }
  }

  /**
   * Public.
   */
  get (key) {
    return this['_' + key];
  }

  /**
   * Public.
   * @param {String} label
   * @param {Function} callback
   */
  on(label, callback) {
    this._event.on(label, callback);
  }

  /**
   * Public.
   * @param {String} label
   * @param {Function} callback
   */
  un (label, callback) {  
    return this._event.un(label, callback);
  }

  /**
   * Public.
   * @param {String} label
   * @param {spread/rest} args
   */
  _emit (label, ...args) {  
    return this._event.emit(label, ...args);
  }

  /**
   * Private.
   * @param {String} key
   * @param {Mixed} value
   * @param {Mixed} oldValue
   */
  _publish (key, value, oldValue) {
    this._emit('publish', this, key, value, oldValue);
  }
}