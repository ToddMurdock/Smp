class Layout {
  constructor (config) {
    this._config = new Config(config);
    this.isLayout = true;
  }

  init (owner) {
    this._owner = owner;
  }

  /**
   * Private.
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  /**
   * Public.
   */
  doLayout () {
    var owner = this._owner,
        layoutEl = owner.getLayoutEl(),
        items = owner.getLayoutItems(),
        len = items.length,
        i = 0;

    this._setLayoutElCls(layoutEl);

    for (; i < len; i++) {
      this._setItemCls(items[i], i);
    }
  }

  /**
   * Private.
   * @param {HTMLElement} layoutEl
   */
  // _setLayoutElCls (layoutEl) {}

  /**
   * Private.
   * @param {Component} item
   */
  // _setItemCls (item) {}
}

ComponentManager.register(Layout, 'layout');