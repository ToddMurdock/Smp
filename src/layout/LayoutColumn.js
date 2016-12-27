class LayoutColumn extends Layout {
  constructor (config) {
    super(config);
    this.isLayoutColumn = true;
  }

  /**
   * Private.
   * @param {HTMLElement} layoutEl
   */
  _setLayoutElCls (layoutEl) {
    super._setLayoutElCls(layoutEl);
    layoutEl.addCls('smp-flex-column');
  }

  /**
   * Private.
   * @param {Component} item
   */
  _setItemCls (item) {
    if (item.getInitialConfig().flex) {
      item.addCls('smp-flex-column-item');
    }
  }
}

ComponentManager.register(LayoutColumn, 'column');