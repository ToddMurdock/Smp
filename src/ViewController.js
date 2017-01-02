class ViewController {

  /**
   * @param {Object} config
   */
  constructor (config) {
    this._config = new Config(config);
  }

  /**
   * Template method.
   * Called once the view is rendered and all bindings are initialized.
   * @param {Component} view
   */
  init (view) {}

  /**
   * Public.
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  /**
   * Public.
   * @param {Component} view
   */
  setView (view) {
    this._config.set('view', view);
  }

  /**
   * Public.
   */
  getView () {
    return this._config.get('view');
  }

  /**
   * Public.
   * @param {ViewModel} viewModel
   */
  setViewModel (viewModel) {
    this._config.set('viewModel', viewModel);
  }

  /**
   * Public.
   */
  getViewModel () {
    return this._config.get('viewModel');
  }

  /**
   * Template method.
   * Public.
   */
  destroy () {}
}