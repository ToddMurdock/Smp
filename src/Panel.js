class Panel extends Component {

  /**
   * CONFIG
   * {String} bodyStyle
   * {Boolean} closable
   * {Components[]} items
   * {Layout/Layout Config} layout
   * {String} title
   */

  /**
   * Private.
   */
  constructor (config) {
    config.bodyHtml = config.html;
    config.data = undefined;
    config.html = undefined;
    config.tpl = undefined;

    super(config);

    this._initLayout();
    this.isPanel = true;
  }

  _getBaseCls () {
    return 'smp-panel';
  }

  /**
   * Private.
   */
  _initLayout () {
    this._layout = ComponentManager.create(this.getConfig('layout') || { type: 'column' });
    this._layout._owner = this;
  }

  /**
   * Private.
   */
  _onRender () {
    super._onRender();

    this._renderHeader();
    this._renderBody();

    this._renderHtml();
    this._renderItems();
    this._doLayout();
  }

  /**
   * Private.
   */
  _renderHeader () {
    var closable = this.getConfig('closable'),
        header = new Header({
          closable: closable,
          renderTo: this._el,
          title: this.getConfig('title')
        });

    if (closable) {
      header.on('closeclick', this._onCloseClick.bind(this));
    }

    this._header = header;
  }

  /**
   * Private.
   */
  _onCloseClick () {
    this.close();
  }

  /**
   * Public.
   */
  close () {
    this.destroy();
  }

  /**
   * Private.
   */
  _renderBody () {
    var template = new Template(),
        bodyStyle = this.getConfig('bodyStyle'),
        data = { style: bodyStyle },
        tpl = '<div class="smp-body" style="{style}"></div>',
        html = template.apply(tpl, data),
        bodyEl = new Element(html);

    if (bodyStyle) {
      bodyEl.setStyle(bodyStyle);
    }

    this._el.appendChild(bodyEl);
    this._bodyEl = bodyEl;
  }

  /**
   * Private.
   */
  _renderHtml () {
    var html = this.getConfig('bodyHtml');

    if (html) {
      this._bodyEl.update(html);
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
      cmp.render(this._bodyEl);
      this._items[i] = cmp;
    }
  }

  /**
   * Public.
   */
  getLayoutEl () {
    return this._bodyEl;
  }

  /**
   * Public.
   */
  getLayoutItems () {
    return this._items;
  }

  /**
   * Private.
   */
  _doLayout () {
    this._el.addCls('smp-flex smp-flex-column');
    this._bodyEl.addCls('smp-flex-column-item');

    if (this._items) {
      this._layout.doLayout();
    }
  }

  /**
   * Private.
   */
  _beforeDestroy () {
    this._header.destroy();
    super._beforeDestroy();
  }
}

ComponentManager.register(Panel, 'panel');