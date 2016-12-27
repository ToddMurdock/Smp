class BinderNew {

  /**
   * CONFIG
   * view
   * viewController
   * viewModel
   */

  constructor (config) {
    this._config = new Config(config);
    this._init();
  }

  /**
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  _init () {
    let controller = this.getConfig('viewController'),
        model = this.getConfig('viewModel'),
        view = this.getConfig('view');

    if (controller) {
      controller.setView(view);
    }

    if (model) {
      model.setView(view);
    }

    if (controller && model) {
      controller.setViewModel(model);
      model.setViewController(controller);
    }
  }

  /**
   * @param {Function/String} handler
   */
  getViewHandler (handler) {
    if (typeof handler === 'function') {
      return handler;
    }

    if (typeof handler === 'string') {
      return this._findViewHandler(handler, this.getConfig('view'));
    }

    return undefined;
  }

  /**
   * @param {String} handler
   * @param {Component} comp
   */
  _findViewHandler (handler, comp) {
    let controller,
        owner;

    if (comp[handler]) {
      return comp[handler].bind(comp);
    }

    controller = comp.getViewController();

    if (controller && controller[handler]) {
      return controller[handler].bind(controller);
    }

    owner = comp._owner;

    if (owner) {
      return this._findViewHandler(handler, owner);
    }

    return undefined;
  }

  initViewBindings () {
    let view = this.getConfig('view'),
        bind = view.getConfig('bind'),
        viewModel;

    if (bind) {
      viewModel = this._findViewModel(view);

      if (viewModel) {
        this._syncWithViewModel(view, viewModel);
      }
    }
  }

  /**
   * @param {Component} view
   * @param {String} viewModelKey
   */
  _syncWithViewModel (view, viewModel) {
    let data = viewModel.getData(),
        key, setter, value;

    for (key in data) {
      setter = this._getViewSetter(view, key);
      value = data[key];
      view[setter](value);
    }
  }

  /**
   * @param {Component} view
   * @param {String} viewModelKey
   */
  _getViewSetter (view, viewModelKey) {
    let bindKey = this._getViewBindKey(view, viewModelKey);

    if (bindKey) {
      return 'set' + bindKey.charAt(0).toUpperCase() + bindKey.slice(1);
    }

    return undefined;
  }

  /**
   * The view's 'bind' config looks like so:
   * bind: {
   *   <View Property>: <ViewModel Property>
   * },
   */
  _getViewBindKey (view, viewModelKey) {
    let bind = view.getConfig('bind'),
        value;

    for (let key in bind) {
      value = bind[key];

      if (value === viewModelKey) {
        return key;
      }
    }

    return undefined;
  }

  /**
   * The configured view is publishing.
   * @param {String} key
   * @param {Mixed} value
   */
  publishToViewViewModel (key, value) {
    let view = this.getConfig('view'),
        viewModel = this.getConfig('viewModel');

    if (!viewModel) {
      viewModel = this._findViewModel(view);
    }

    if (viewModel) {
      viewModel.set(key, value);
    }
  }

  /**
   * @param {Component} comp
   */
  _findViewModel (comp) {
    let viewModel = comp.getViewModel();

    if (viewModel) {
      return viewModel;
    }

    if (comp._owner) {
      return this._findViewModel(comp._owner);
    }

    return undefined;
  }
}