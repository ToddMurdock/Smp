class LayoutRow extends Layout {
  constructor (config) {
    super(config);
    this.isLayoutRow = true;
  }

  /**
   * Private.
   * @param {HTMLElement} layoutEl
   */
  _setLayoutElCls (layoutEl) {
    layoutEl.addCls('smp-flex');
    layoutEl.addCls('smp-flex-row');
  }

  /**
   * Private.
   * @param {Component} item
   */
  _setItemCls (item) {
    if (item.getInitialConfig().flex) {
      item.addCls('smp-flex-row-item');
    }
  }
}

ComponentManager.register(LayoutRow, 'row');