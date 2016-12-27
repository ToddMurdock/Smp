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
class Component {

  /**
   * CONFIG
   * {Object} bind
   * {String} cls
   * {Object} data
   * {String} html
   * {Object} listeners
   * {Boolean} fullscreen
   * {String} style
   * {String} tpl
   * {ViewController} viewController
   * {ViewModel} viewModel
   */

  /**
   * Public
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  getInitialConfig () {
    return this._config.getInitialConfig();
  }

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
    this._config = new Config(config);

    this._baseCls = this.getConfig('baseCls') || 'smp-component';
    this._event = new Event();
    this._id = ComponentManager.id();
    this._owner;
    this._renderTpl = this.getConfig('renderTpl') || '<div id="{id}" class="{cls}" style="{style}"></div>';

    this._initBinder();

    this.isComponent = true;
    ComponentManager.registerInstance(this);
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

  _getRenderData () {
    let cls = this._baseCls,
        configCls = this.getConfig('cls'),
        configStyle = this.getConfig('style'),
        fullscreen = this.getConfig('fullscreen'),
        style = '';

    if (configCls) {
      cls += ' ' + configCls;
    }

    if (fullscreen) {
      cls += ' smp-fullscreen';
    }

    if (configStyle) {
      style = configStyle;
    }

    return {
      cls: cls,
      id: this.getId(),
      style: style
    };
  }

  /**
   * Public.
   */
  getEl () {
    return this._el;
  }

  /**
   * Public.
   */
  getId () {
    return this._baseCls + '-' + this._id;
  }

  /**
   * Public
   * @param {String} cls
   */
  addCls (cls) {
    this._el.addCls(cls);
  }

  /**
   * Public
   */
  getBox () {
    return this._el.getBox();
  }

  /**
   * Public
   * @param {Number} [width]
   * @param {Number} [height]
   */
  setSize (width, height) {
    if (width || height) {
      this._el.setSize(width, height);
      this._onResize();
    }
  }

  _onResize () {
    this._emit('resize', this, this.getBox());
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

  /**
   * Public.
   * @param {String} html
   */
  update (html) {
    this._el.update(html);
  }

  /**
   * Public
   * @param {HTMLElement} [container]
   * @param {String} [position] 'before' or 'after'
   */
  render (container, position) {
    let template = new Template(),
        data = this._getRenderData(),
        html = template.apply(this._renderTpl, data),
        el = new Element(html);

    Dom.insert(container || this.getConfig('renderTo'), el.dom, position);

    this._el = el;
    this._rendered = true;
    this._onRender();
    this._emit('render', this);
    this._initEvents();
  }

  _onRender () {
    let data = this.getConfig('data'),
        html = this.getConfig('html'),
        height = this.getConfig('height'),
        width = this.getConfig('width');

    if (html) {
      this.update(html);
    }

    else if (data) {
      this.setData(data);
    }

    this.setSize(width, height);
  }

  _initEvents () {
    let listeners = this.getConfig('listeners');

    if (listeners) {
      for (let key in listeners) {
        this.on(key, this._getListenerHandler(listeners[key]));
      }
    }

    // Will add 'resize-trigger' element to this component.
    // removeResizeListener(resizeElement, resizeCallback);
    // addResizeListener(this._el, function () {
    //   me._onResize();
    // });

    // To allow Dom.un(...) to work
    this._boundOnWindowResize = this._onWindowResize.bind(this);
    Dom.on(window, 'resize', this._boundOnWindowResize);
  }

  _onWindowResize () {
    let fullscreen = this.getConfig('fullscreen');

    if (fullscreen) {
      this.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
    } else {
      this._onResize();
    }
  }

  /**
   * @param {String} label
   * @param {Function/String} callback
   */
  on (label, callback) {
    this._event.on(label, callback);
  }

  /**
   * @param {String} label
   * @param {Function} callback
   */
  un (label, callback) {  
    return this._event.un(label, callback);
  }

  /**
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
    Dom.un(window, 'resize', this._boundOnWindowResize);
    this._event.destroy();
  }

  _afterDestroy () {
    ComponentManager.unregisterInstance(this);
  }

  destroy () {
    this._beforeDestroy();
    
    if (this._owner && this._owner.remove) {
      this._owner.remove(this);
    }

    this._el.destroy();    
    this._afterDestroy();
  }
}

ComponentManager.register(Component, 'component');