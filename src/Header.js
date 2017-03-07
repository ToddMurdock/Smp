class Header {

  /**
   * CONFIG
   * {Boolean} closable
   * {String} closeIconCls
   * {String} iconCls
   * {Element} renderTo
   * {String} title
   */

  /**
   * Override to implement the iconCls for the close button.
   * Example: Header.getCloseIconCls = function () { return '...'; }
   */
  static getCloseIconCls () {
    return '';
  }

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
   * Public.
   * @param {String} cls
   */
  setIconCls (cls) {
    var el = this._iconEl,
        oldCls;

    if (el) {
      oldCls = this.getConfig('iconCls');

      if (oldCls) {
        el.removeCls(oldCls);
      }

      this._config.set('iconCls', cls);
      el.addCls(cls);
    }
  }

  /**
   * Public.
   * @param {String} title
   */
  setTitle (title) {
    this._config.set('title', title);
    this._titleEl.update(title);
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
        closeIconCls = this.getConfig('closeIconCls') || Header.getCloseIconCls(),
        iconCls = this.getConfig('iconCls'),
        renderTo = this.getConfig('renderTo'),
        data = { title: this.getConfig('title') },
        tpl = '<div class="smp-header">' +
                (iconCls ? '<div class="smp-icon-wrap"><div class="smp-icon ' + iconCls + '"></div></div>' : '') +
                '<div class="smp-title">{title}</div>' +
                (closable ? '<div class="smp-close ' + closeIconCls + '"></div>' : '') +
              '</div>',
        el = new Element(template.apply(tpl, data));

    renderTo.appendChild(el.dom);

    this._el = el;
    this._titleEl = new Element(Dom.select('.smp-title', el.dom)[0]);

    if (closable) {
      this._closeEl = new Element(Dom.select('.smp-close', el.dom)[0]);
    }

    if (iconCls) {
      this._iconEl = new Element(Dom.select('.smp-icon', el.dom)[0]);
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

    if (this._iconEl) {
      this._iconEl.destroy();
    }

    this._titleEl.destroy();
    this._el.destroy();
  }
}