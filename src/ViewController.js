class ViewController {
  constructor (config) {
    this._config = new Config(config);
  }

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

  getView () {
    this._config.get('view');
  }

  /**
   * Public.
   * @param {ViewModel} viewModel
   */
  setViewModel (viewModel) {
    this._config.set('viewModel', viewModel);
  }

  getViewModel () {
    return this._config.get('viewModel');
  }
}