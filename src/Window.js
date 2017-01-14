class Window extends Panel {

  /**
   * CONFIG
   * {Boolean} modal
   */

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
    Object.assign(config, {
      closable: true,
      draggable: true,
      renderTo: document.body
    });

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
    var modal = this.getConfig('modal'),
        el;

    if (modal) {
      el = new Element('<div class="smp-modal"></div>');

      el.appendChild(this._el);
      document.body.appendChild(el.dom);

      this._modalEl = el;
    }
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
    var modalEl = this._modalEl;

    if (modalEl) {
      modalEl.destroy();
      modalEl = undefined;
    }
  }
}

ComponentManager.register(Window, 'window');