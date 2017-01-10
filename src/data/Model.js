class Model {

  /**
   * CONFIG
   * data
   */

  /**
   * Public.
   */
  getData () {
    return this._data;
  }

  /**
   * Public
   * @param {String} key
   * @param {Mixed} value
   */
  set (key, value) {
    var oldValue = this.get(key);

    if (value !== oldValue) {
      this._data[key] = value;

      this._onChange({
        field: key,
        value: value,
        oldValue: oldValue
      });
    }
  }

  /**
   * Public.
   */
  get (key) {
    return this._data[key];
  }

  /**
   * Public.
   * @param {Store} store
   */
  setStore (store) {
    this._store = store;
  }

  /**
   * Public.
   */
  getStore () {
    return this._store;
  }

  /**
   * Private.
   * @param {Object} config
   */
  constructor (config) {
    this._setConfig(config);
  }

  /**
   * Private.
   */
  _setConfig (config) {
    if (config) {
      this._config = config;

      for (var key in config) {
        this['_' + key] = config[key];
      }
    }
  }

  /**
   * Private.
   * @param {Object} change
   * Example:
   * {
   *   field: key,
   *   value: value,
   *   oldValue: oldValue
   * }
   */
  _onChange (change) {
    if (this._store) {
      this._store._onModelChange(this, change);
    }
  }
}