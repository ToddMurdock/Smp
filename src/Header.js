class Header {

  /**
   * CONFIG
   * {Boolean} closable
   * {Element} renderTo
   * {String} title
   */

  /**
   * Public.
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
  getTitleEl () {
    return this._titleEl;
  }

  /**
   * Private.
   */
  constructor (config) {
    this._config = new Config(config);
    this._event = new Event();
    this._el;

    this.render();
  }

  /**
   * Private.
   */
  render () {
    var template = new Template(),
        closable = this.getConfig('closable'),
        renderTo = this.getConfig('renderTo'),
        data = { title: this.getConfig('title') },
        tpl = '<div class="smp-header smp-flex smp-flex-row">' +
                '<div class="smp-title smp-flex-row-item">{title}</div>' +
                (closable ? '<div class="smp-close fa fa-times"></div>' : '') +
              '</div>',
        el = new Element(template.apply(tpl, data));

    renderTo.appendChild(el.dom);

    this._el = el;
    this._titleEl = new Element(Dom.select('.smp-title', el.dom));

    if (closable) {
      this._closeEl = new Element(Dom.select('.smp-close', el.dom));
    }

    this._onRender();
  }

  /**
   * Private.
   */
  _onRender () {
    this._initEvents();
  }

  /**
   * Private.
   */
  _initEvents () {
    var closeEl = this._closeEl;

    if (closeEl) {
      closeEl.on('click', this._onCloseClick.bind(this));
    }
  }

  /**
   * Private.
   */
  _onCloseClick () {
    this._emit('closeclick', this);
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
   */
  _beforeDestroy () {
    this._event.destroy();
  }

  /**
   * Private.
   */
  destroy () {
    this._beforeDestroy();

    if (this._closeEl) {
      this._closeEl.destroy();
    }

    this._titleEl.destroy();
    this._el.destroy();
  }
}