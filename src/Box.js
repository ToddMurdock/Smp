class Box {

  /**
   * CONFIG
   * {String} cls
   * {Object} listeners
   * {Boolean} fullscreen
   * {String} style
   */

  /**
   * Public
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  /**
   * Public.
   */
  getInitialConfig () {
    return this._config.getInitialConfig();
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
    return this._getBaseCls() + '-' + this._id;
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
   * @param {String} cls
   */
  removeCls (cls) {
    this._el.removeCls(cls);
  }

  /**
   * Public.
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

  /**
   * Private.
   * @param {Object} config
   */
  constructor (config) {
    this._config = new Config(config);
    this._event = new Event();
    this._id = ComponentManager.id();

    this.isBox = true;
    ComponentManager.registerInstance(this);
  }

  _getBaseCls () {
    return 'smp-box';
  }

  _getRenderTpl () {
    return '<div id="{id}" class="{cls}" style="{style}"></div>';
  }

  /**
   * Private.
   */
  _getRenderData () {
    var cls = this._getBaseCls(),
        configCls = this.getConfig('cls'),
        configStyle = this.getConfig('style'),
        fullscreen = this.getConfig('fullscreen'),
        style = configStyle || '';

    cls += configCls ? ' ' + configCls : '';
    cls += fullscreen ? ' smp-fullscreen' : '';

    return {
      cls: cls,
      id: this.getId(),
      style: style
    };
  }

  /**
   * Private.
   */
  _onResize () {
    this._emit('resize', this, this.getBox());
  }

  /**
   * Public.
   * @param {String} html
   */
  update (html) {
    this._el.update(html);
  }

  /**
   * Public.
   * @param {HTMLElement} [container]
   * @param {String} [position] 'before' or 'after'
   */
  render (container, position) {
    var template = new Template(),
        data = this._getRenderData(),
        renderTo = container || this.getConfig('renderTo'),
        html = template.apply(this._getRenderTpl(), data),
        el = new Element(html);

    Dom.insert(renderTo, el.dom, position);

    this._el = el;
    this._rendered = true;
    this._onRender();
    this._emit('render', this);
    this._initEvents();
  }

  /**
   * Private.
   */
  _onRender () {
    var height = this.getConfig('height'),
        width = this.getConfig('width');

    this.setSize(width, height);
  }

  /**
   * Private.
   */
  _initEvents () {
    var fullscreen = this.getConfig('fullscreen');

    if (fullscreen) {
      this._boundOnWindowResize = this._onWindowResize.bind(this);
      Dom.on(window, 'resize', this._boundOnWindowResize);
    }
  }

  /**
   * Private.
   */
  _onWindowResize () {
    var el = document.documentElement;
    this.setSize(el.clientWidth, el.clientHeight);
  }

  /**
   * Public.
   * @param {String} label
   * @param {Function/String} callback
   */
  on (label, callback) {
    this._event.on(label, callback);
  }

  /**
   * Public.
   * @param {String} label
   * @param {Function} callback
   */
  un (label, callback) {  
    return this._event.un(label, callback);
  }

  /**
   * Private.
   * @param {String} label
   * @param {spread/rest} args
   */
  _emit (label, ...args) {  
    return this._event.emit(label, ...args);
  }

  /**
   * Private.
   * @param {Object} a
   * @param {Object} b
   */
  _apply (a, b) {
    a = a || {};

    for (var key in b) {
      a[key] = b[key];
    }
  }

  /**
   * Private.
   * @param {Object} a
   * @param {Object} b
   */
  _applyIf (a, b) {
    a = a || {};

    for (var key in b) {
      if (!a[key]) {
        a[key] = b[key];
      }
    }
  }

  /**
   * Private.
   */
  _beforeDestroy () {
    if (this._boundOnWindowResize) {
      Dom.un(window, 'resize', this._boundOnWindowResize);
    }

    this._event.destroy();
  }

  /**
   * Private.
   */
  _afterDestroy () {
    ComponentManager.unregisterInstance(this);
  }

  /**
   * Public.
   */
  destroy () {
    this._beforeDestroy();
    this._emit('destroy', this);
    this._el.destroy();
    this._afterDestroy();
  }
}

ComponentManager.register(Box, 'box');