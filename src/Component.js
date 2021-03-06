/**
 * @usage
{
  bind: {
    data: 'compData'
  },
  tpl: '<div>{Text}</div>',
  type: 'component',
  viewModel: new ViewModel({
    data: {
      compData: { Text: 'Hello' }
    }
  })
}
 */
class Component extends Box {

  /**
   * CONFIG
   * {Object} bind
   * {Object} listeners
   * {ViewController} viewController
   * {ViewModel} viewModel
   */

  /**
   * Public
   */
  getViewController () {
    return this.getConfig('viewController');
  }

  /**
   * Public
   */
  getViewModel () {
    return this.getConfig('viewModel');
  }

  /**
   * Override.
   * Public.
   * {Boolean} hidden
   */
  setHidden (hidden) {
    if (super.setHidden(hidden)) {
      this._publish('hidden', hidden);
    }
  }

  /**
   * @param {Object} config
   */
  constructor (config) {
    super(config);

    this._owner = undefined;
    this._initBinder();
    this.isComponent = true;
  }

  _getBaseCls () {
    return 'smp-component';
  }

  /**
   * Private.
   */
  _initBinder () {
    var controller = this.getViewController(),
        model = this.getViewModel();

    this._binder = new Binder({
      view: this,
      viewController: controller,
      viewModel: model
    });
  }

  /**
   * Private.
   */
  _initEvents () {
    super._initEvents();
    this._initListeners();
  }

  _initListeners () {
    var listeners = this.getConfig('listeners'),
        handler, scope;

    if (listeners) {
      scope = listeners.scope;

      for (var key in listeners) {
        if (key === 'scope') {
          continue;
        }

        handler = listeners[key];

        if (scope) {
          if (typeof handler === 'function') {
            handler = handler.bind(scope);
          } else if (typeof handler === 'string') {
            handler = scope[handler].bind(scope);
          }
        } else {
          handler = this._getListenerHandler(handler);
        }

        this.on(key, handler);
      }
    }
  }

  /**
   * Private.
   * @param {String} key
   * @param {Mixed} value
   */
  _publish (key, value) {
    this._emit('publish', this, key, value);
  }

  /**
   * Private.
   * @param {Function/String} handler
   */
  _getListenerHandler (handler) {
    return this._binder.getHandler(handler);
  }

  /**
   * Private.
   */
  _afterDestroy () {
    this._binder.destroy();

    if (this._owner && this._owner.remove) {
      this._owner.remove(this);
    }

    super._afterDestroy();
  }
}

ComponentManager.register(Component, 'component');