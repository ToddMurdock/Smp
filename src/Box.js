class Box {

  /**
   * CONFIG
   * {String} cls
   * {Object} data
   * {String} html
   * {Boolean} fullscreen
   * {String} tpl
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
  }

  /**
   * Public.
   */
  getData () {
    return this.getConfig('data');
  }

  /**
   * Public.
   * @param {String} html
   */
  setHtml (html) {
    this._config.set('html', html);

    if (this._rendered) {
      this.update(html);
    }
  }

  getHtml () {
    return this.getConfig('html');
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
    this._initEvents();
    this._emit('render', this);
  }

  /**
   * Private.
   */
  _onRender () {
    var data = this.getConfig('data'),
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

  /**
   * Private.
   */
  _initEvents () {}

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
   */
  _beforeDestroy () {
    if (this._boundSyncFullscreen) {
      Dom.un(window, 'resize', this._boundSyncFullscreen);
    }
  }

  /**
   * Private.
   */
  _afterDestroy () {
    this._event.destroy();
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