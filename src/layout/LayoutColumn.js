class LayoutColumn extends Layout {

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

    this.isLayoutColumn = true;
  }

  /**
   * Private.
   * @param {HTMLElement} layoutEl
   */
  _setLayoutElCls (layoutEl) {
    var cls = 'smp-flex smp-flex-column',
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
    var flex = item.getInitialConfig().flex;

    item.addCls('smp-flex-column-item');

    if (flex) {
      item.setStyle({
        '-webkit-box-flex': flex,
        '-moz-box-flex': flex,
        '-webkit-flex': flex,
        '-ms-flex': flex,
        'flex': flex
      });
    }
  }
}

ComponentManager.register(LayoutColumn, 'column');