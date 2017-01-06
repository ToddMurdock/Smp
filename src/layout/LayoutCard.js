/**
 * @usage
{
  activeItem: 1,
  items: [ ... ],
  layout: {
    type: 'card'
  },
  type: 'container'
}
 */
class LayoutCard extends Layout {
  constructor (config) {
    super(config);
    this.isLayoutCard = true;
  }

  /**
   * Public.
   * @param {Container} owner
   */
  init (owner) {
    super.init(owner);
    this._config.set('activeItem', owner.getConfig('activeItem'));
    this._owner.setActiveItem = this.setActiveItem.bind(this);
  }

  /**
   * Public.
   * @param {Number} index
   */
  setActiveItem (index) {
    this._config.set('activeItem', index);
    this.doLayout();
  }

  /**
   * Private.
   * @param {HTMLElement} layoutEl
   */
  _setLayoutElCls (layoutEl) {
    layoutEl.addCls('smp-card');
  }

  /**
   * Private.
   * @param {Component} item
   * @param {Number} index
   */
  _setItemCls (item, index) {
    let activeCls = 'smp-card-active-item',
        activeIndex = this.getConfig('activeItem') - 1;

    item.addCls('smp-card-item');

    if (index === activeIndex) {
      item.addCls(activeCls);
    } else {
      item.removeCls(activeCls);
    }
  }
}

ComponentManager.register(LayoutCard, 'card');