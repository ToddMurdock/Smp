class LayoutRow extends Layout {

  /**
   * CONFIG
   * {String} align
   */

  constructor (config) {
    super(config);

    this._alignOptions = {
      baseline: 'baseline',
      center: 'center',
      end: 'flex-end',
      start: 'flex-start',
      stretch: 'stretch'
    };

    this.isLayoutRow = true;
  }

  /**
   * Private.
   * @param {HTMLElement} layoutEl
   */
  _setLayoutElCls (layoutEl) {
    var cls = 'smp-flex smp-flex-row',
        align = this.getConfig('align');

    if (align && this._alignOptions[align]) {
      cls += ' smp-flex-align-' + this._alignOptions[align];
    }

    layoutEl.addCls(cls);
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