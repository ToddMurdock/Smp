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
   * {Object} data
   * {String} html
   * {String} tpl
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
   * @param {Object} config
   */
  constructor (config) {
    super(config);

    this._owner;
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
   * Public
   * @param {Object} data
   */
  setData (data) {
    this._config.set('data', data);

    if (this._rendered) {
      var template = new Template(),
          tpl = this.getConfig('tpl'),
          html = template.apply(tpl, data);

      this.update(html);
    }

    this._publish('data', data);
  }

  /**
   * Public.
   */
  getData () {
    return this._config.get('data');
  }

  /**
   * Private.
   */
  _onRender () {
    super._onRender();

    var data = this.getConfig('data'),
        html = this.getConfig('html');

    if (html) {
      this.update(html);
    }

    else if (data) {
      this.setData(data);
    }
  }

  /**
   * Private.
   */
  _initEvents () {
    super._initEvents();

    var listeners = this.getConfig('listeners');

    if (listeners) {
      for (var key in listeners) {
        this.on(key, this._getListenerHandler(listeners[key]));
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
  _beforeDestroy () {
    super._beforeDestroy();

    this._binder.destroy();

    if (this._owner && this._owner.remove) {
      this._owner.remove(this);
    }
  }
}

ComponentManager.register(Component, 'component');