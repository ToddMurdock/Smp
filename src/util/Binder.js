class Binder {

  /**
   * CONFIG
   * view
   * viewController
   * viewModel
   */

  constructor (config) {
    this._config = new Config(config);
    this._init();
    this._initView();
    this._initViewModel();
  }

  /**
   * Public.
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  /**
   * Private.
   * Call setters
   */
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

  //
  // Handler
  //

  /**
   * Public.
   * @param {Function/String} handler
   */
  getHandler (handler) {
    if (typeof handler === 'function') {
      return handler;
    }

    if (typeof handler === 'string') {
      return this._findHandler(handler, this.getConfig('view'));
    }

    return undefined;
  }

  /**
   * Private.
   * @param {String} handler
   * @param {Component} view
   */
  _findHandler (handler, view) {
    let controller,
        owner;

    if (view[handler]) {
      return view[handler].bind(view);
    }

    controller = view.getViewController();

    if (controller && controller[handler]) {
      return controller[handler].bind(controller);
    }

    owner = view._owner;

    if (owner) {
      return this._findHandler(handler, owner);
    }

    return undefined;
  }

  //
  // View
  //

  /**
   * Private.
   */
  _initView () {
    let me = this,
        view = me.getConfig('view'),
        bind = view.getConfig('bind');

    if (bind) {
      // View has 'bind' config.  Sync the data on 'render'.
      view.on('render', me._onViewRender.bind(me));
    }

    view.on('publish', function (view, key, value, oldValue) {
      if (!me._ignoreViewChange) {
        me._syncViewModel(view, key, value);
      }
    });
  }

  /**
   * Private.
   * View has 'bind' config.  Sync the data on 'render'.
   * @param {Component} view
   */
  _onViewRender (view) {
    let data, key, value, viewModel;

    view.un('render', this._onViewRender);
    viewModel = this._findViewModel(view);

    if (viewModel) {
      data = viewModel.getData();

      for (key in data) {
        value = data[key];
        this._syncViews(key, value);
      }
    }
  }

  /**
   * Private.
   * The view's 'publish' event was fired.
   * @param {Component} view
   * @param {String} viewKey
   * @param {Mixed} value
   */
  _syncViewModel (view, viewKey, value) {
    let viewModel = this._findViewModel(view),
        viewModelKey = this._getViewModelBindKey(viewKey);

    this._ignoreViewModelChange = true;
    viewModel.set(viewModelKey, value);
    this._ignoreViewModelChange = false;
  }

  /**
   * Private.
   * The view's 'bind' config looks like so:
   * bind: { <viewKey>: <viewModelKey> }
   * @param {String} viewKey
   */
  _getViewModelBindKey (viewKey) {
    let view = this.getConfig('view'),
        bind = view.getConfig('bind')

    for (let key in bind) {
      if (key === viewKey) {
        return bind[key];
      }
    }

    return undefined;
  }

  /**
   * Private.
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

  //
  // ViewModel
  //

  _initViewModel () {
    let me = this,
        viewModel = me.getConfig('viewModel');

    if (!viewModel) {
      return false;
    }

    viewModel.on('publish', function (viewModel, key, value, oldValue) {
      if (!me._ignoreViewModelChange) {
        me._syncViews(key, value);
      }
    });

    return true;
  }

  /**
   * Private.
   * The view model's 'publish' event was fired.
   * @param {String} viewModelKey
   * @param {Mixed} value
   */
  _syncViews (viewModelKey, value) {
    let found = [],
        i, item, len, view, setter;

    this._findViews(viewModelKey, this.getConfig('view'), found);

    len = found.length;
    i = 0;

    this._ignoreViewChange = true;

    for (; i < len; i++) {
      item = found[i];
      view = item.view;
      setter = item.setter;

      view[setter](value);
    }

    this._ignoreViewChange = undefined;
  }

  /**
   * The 'bind' config on the View looks like so:
   * bind: { <viewKey>: <viewModelKey> }
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
   * The 'bind' config on the View looks like so:
   * bind: { <viewKey>: <viewModelKey> }
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
   * The 'bind' config on the View looks like so:
   * bind: { <viewKey>: <viewModelKey> }
   * Returns array of bound Views.
   * @param {String} viewModelKey
   * @param {Component} comp
   * @param {Component[]} views
   */
  _findViews (viewModelKey, comp, views) {
    let bind = comp.getConfig('bind'),
        i, items, len, viewKey;

    if (bind) {
      viewKey = this._getViewBindKey(comp, viewModelKey);

      if (viewKey) {
        views.push({ view: comp, setter: this._getViewSetter(comp, viewModelKey) });
      }
    }

    if (comp.isContainer) {
      items = comp.getLayoutItems();
      len = items.length;
      i = 0;

      for (; i < len; i++) {
        this._findViews(viewModelKey, items[i], views);
      }
    }

    return items;
  }
}