class Panel extends Component {

  /**
   * CONFIG
   * {String} bodyStyle
   * {Boolean} closable
   * {String} iconCls
   * {Components[]} items
   * {Layout/Layout Config} layout
   * {String} title
   */

  /**
   * Public.
   */
  close () {
    this.destroy();
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
   * Public.
   */
  setIconCls (cls) {
    this._header.setIconCls(cls);
  }

  /**
   * Public.
   */
  setTitle (title) {
    this._header.setTitle(title);
  }

  /**
   * Private.
   */
  constructor (config) {
    Object.assign(config, {
      bodyHtml: config.html,
      data: undefined,
      html: undefined,
      tpl: undefined
    });

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
          iconCls: this.getConfig('iconCls'),
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

    comp.destroy();
  }

  /**
   * Public.
   */
  removeAll () {
    var i = this._items.length - 1;

    for (; i >= 0; i--) {
      this._items[i].destroy();
    }

    this._items = [];
  }

  /**
   * Public.
   */
  destroy () {
    this.removeAll();
    super.destroy();
  }
}

ComponentManager.register(Panel, 'panel');