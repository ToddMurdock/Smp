class Window extends Panel {

  /**
   * Public.
   */
  show () {
    this.render();
  }

  /**
   * Private.
   */
  constructor (config) {
    config.closable = true;
    config.draggable = true;
    config.renderTo = document.body;
    super(config);

    this.isWindow = true;
  }

  _getBaseCls () {
    return 'smp-window';
  }

  /**
   * Private.
   */
  _onRender () {
    super._onRender();
    this._renderModal();
    this._initDraggable();
  }

  /**
   * Private.
   */
  _renderModal () {
    var el = new Element('<div class="smp-modal"></div>');

    el.appendChild(this._el);
    document.body.appendChild(el.dom);

    this._modelEl = el
  }

  /**
   * Private.
   */
  _doLayout () {
    super._doLayout();

    var box = this.getBox();

    this._el.setStyle('left', 'calc(50% - ' + (box.width / 2) + 'px)');
    this._el.setStyle('top', 'calc(50% - ' + (box.height / 2) + 'px)');

  }

  /**
   * Private.
   */
  _initDraggable () {
    this._drag = new WindowDrag({
      dragEl: this._header._titleEl,
      window: this
    });
  }

  /**
   * Private.
   */
  _beforeDestroy () {
    this._drag.destroy();
    super._beforeDestroy();
  }

  /**
   * Private.
   */
  _afterDestroy () {
    this._modelEl.destroy();
    delete this._modelEl;
  }
}

ComponentManager.register(Window, 'window');