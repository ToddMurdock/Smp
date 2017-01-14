class Sheet extends Panel {

  /**
   * CONFIG
   * {Boolean} modal
   * {String} side
   */

  /**
   * Public.
   */
  show () {
    var me = this,
        side = me.getConfig('side');

    me.render();

    // Safari fix
    setTimeout(function () {
      me.addCls('smp-sheet-show-' + side);
    }, 50);
  }

  /**
   * Private.
   */
  constructor (config) {
    config.closable = true;
    config.renderTo = document.body;
    config.side = config.side || 'left';
    super(config);
  }

  /**
   * Private.
   */
  _getBaseCls () {
    return 'smp-sheet';
  }

  _getRenderData () {
    var data = super._getRenderData(),
        side = this.getConfig('side');

    data.cls += ' smp-sheet-' + side;

    return data;
  }

  /**
   * Private.
   */
  _onRender () {
    super._onRender();
    this._renderModal();
  }

  /**
   * Private.
   */
  _renderModal () {
    var modal = this.getConfig('modal'),
        el;

    if (modal) {
      el = new Element('<div class="smp-modal"></div>');
      Dom.insert(this._el.dom, el.dom, 'before');
      this._modalEl = el;
    }
  }

  /**
   * Private.
   */
  _onCloseClick () {
    var me = this,
        side = this.getConfig('side');

    // For cross browser transition events.
    // callmenick.com/post/cross-browser-transition-animation-events-modernizr
    me._el.on('transitionend', function () {
      me.close();
    });

    this.removeCls('smp-sheet-show-' + side);
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

ComponentManager.register(Sheet, 'sheet');