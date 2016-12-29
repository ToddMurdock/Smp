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
    config.baseCls = config.baseCls || 'smp-component';
    super(config);

    this._owner;
    this._initBinder();
    this.isComponent = true;
  }

  _initBinder () {
    let controller = this.getViewController(),
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
      let template = new Template(),
          tpl = this.getConfig('tpl'),
          html = template.apply(tpl, data);

      this.update(html);
    }

    this._publish('data', data);
  }

  getData () {
    return this._config.get('data');
  }

  _onRender () {
    super._onRender();

    let data = this.getConfig('data'),
        html = this.getConfig('html');

    if (html) {
      this.update(html);
    }

    else if (data) {
      this.setData(data);
    }
  }

  _initEvents () {
    super._initEvents();

    let listeners = this.getConfig('listeners');

    if (listeners) {
      for (let key in listeners) {
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

  _beforeDestroy () {
    super._beforeDestroy();
    
    if (this._owner && this._owner.remove) {
      this._owner.remove(this);
    }
  }
}

ComponentManager.register(Component, 'component');