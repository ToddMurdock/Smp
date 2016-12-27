class Window extends Component {

  /**
   * Public.
   */
  show () {
    this.render();
  }

  constructor (config) {
    config.baseCls = 'smp-window';
    config.draggable = true;
    config.renderTo = document.body;
    super(config);

    this._initLayout();
    this.isWindow = true;
  }

  _initLayout () {
    this._layout = ComponentManager.create(this.getConfig('layout') || { type: 'column' });
    this._layout._owner = this;
  }

  _onRender () {
    super._onRender();

    this._el.addCls('smp-flex');
    this._el.addCls('smp-flex-column');

    this._renderModal();
    this._renderHeader();
    this._renderBody();
    this._initDraggable();

    this._renderItems();
    this._doLayout();
  }

  _renderModal () {
    let el = new Element('<div class="smp-modal"></div>');

    el.appendChild(this._el);
    document.body.appendChild(el.dom);

    this._modelEl = el
  }

  _renderHeader () {
    let template = new Template(),
        el = this._el,
        data = { title: this.getConfig('title') },
        tpl = '<div class="smp-header smp-flex smp-flex-row"><div class="smp-title smp-flex-row-item" draggable="true">{title}</div><div class="smp-close fa fa-times"></div></div>',
        headerEl = Dom.create(template.apply(tpl, data));

    el.appendChild(headerEl);
    this._headerEl = headerEl;
    this._titleEl = Dom.select('.smp-title', this._headerEl);
    this._closeEl = Dom.select('.smp-close', headerEl);

    this._boundOnCloseClick = this._onCloseClick.bind(this);
    Dom.on(this._closeEl, 'click', this._boundOnCloseClick);
  }

  _onCloseClick () {
    this.close();
  }

  close () {
    this.destroy();
  }

  _renderBody () {
    let bodyEl = new Element('<div class="smp-body smp-flex-column-item"></div>');

    this._el.appendChild(bodyEl);
    this._bodyEl = bodyEl;
  }

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

  getLayoutEl () {
    return this._bodyEl;
  }

  getLayoutItems () {
    return this._items;
  }

  _doLayout () {
    let box = this.getBox();

    this._el.setStyle('left', 'calc(50% - ' + (box.width / 2) + 'px)');
    this._el.setStyle('top', 'calc(50% - ' + (box.height / 2) + 'px)');

    if (this._items) {
      this._layout.doLayout();
    }
  }

  _initDraggable () {
    this._drag = new WindowDrag(this);
  }

  _beforeDestroy () {
    this._drag.destroy();

    Dom.un(this._closeEl, 'click', this._boundOnCloseClick);
    super._beforeDestroy();
  }

  _afterDestroy () {
    this._modelEl.destroy();
    delete this._modelEl;
  }
}