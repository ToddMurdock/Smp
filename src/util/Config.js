class Config {
  /**
   * @param {Object} config
   */
  constructor (config) {
    if (config) {
      this._initialConfig = config;

      for (let key in config) {
        this['_' + key] = config[key];
      }
    }
  }

  /**
   * Public
   * @param {String} key
   * @param {Mixed} value
   */
  set (key, value) {
    this['_' + key] = value;
  }

  /**
   * Public
   * @param {String} key
   */
  get (key) {
    return this['_' + key];
  }

  /**
   * Public
   */
  getInitialConfig () {
    return this._initialConfig;
  }
}