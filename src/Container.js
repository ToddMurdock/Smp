class Container extends Component {

  /**
   * items
   * layout
   */

  constructor (config) {
    config.baseCls = config.baseCls || 'smp-container';
    super(config);

    this.isContainer = true;
    this._initLayout();
  }

  /**
   * Private.
   */
  _initLayout () {
    this._layout = ComponentManager.create(this.getConfig('layout') || { type: 'layout' });
    this._layout.init(this);
  }

  /**
   * Private.
   */
  _onRender () {
    super._onRender();

    this._renderItems();
    this._doLayout();
  }

  /**
   * Private.
   */
  _doLayout () {
    if (this._items) {
      this._layout.doLayout();
    }
  }

  /**
   * Private.
   */
  _renderItems () {
    var items = this.getConfig('items'),
        cmp, i, len;

    if (!items) {
      return;
    }

    this._items = [];

    for (i = 0, len = items.length; i < len; i++) {
      if (items[i].type) {
        cmp = ComponentManager.create(items[i]);
      } else {
        cmp = items[i];
      }

      cmp._owner = this;
      cmp.render(this._el.dom);
      this._items[i] = cmp;
    }
  }

  /**
   * Public.
   */
  getLayoutEl () {
    return this.getEl();
  }

  /**
   * Public.
   */
  getLayoutItems () {
    return this._items;
  }

  /**
   * Public.
   * @param {Component} comp
   */
  remove (comp) {
    var len = this._items.length,
        i = 0;
    
    for (; i < len; i++) {
      if (this._items[i] === comp) {
        this._items.splice(i, 1);
        return;
      }
    }
  }
}

ComponentManager.register(Container, 'container');