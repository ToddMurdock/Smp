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
    Object.assign(config, {
      closable: true,
      renderTo: document.body,
      side: config.side || 'left'
    });

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

    me._prefixEvent(me._el, 'TransitionEnd', function () {
      me._closing = true;
      me.close();
    });

    this.removeCls('smp-sheet-show-' + side);

    // Backup incase 'transitionend' does not fire
    // CSS transition is for 500 ms.
    window.setTimeout(function () {
      if (!me._closing) {
        me.close();
      }
    }, 750);
  }

  /**
   * Prefix CSS transition events for the following browsers.
   * W3C, standard, Firefox, webkit, Opera, IE10
   */
  _prefixEvent (element, type, callback) {
    var pfx = ['webkit', 'moz', 'MS', 'o', ''];

    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) {
        type = type.toLowerCase();
      }

      // Example: If type = 'TransitionEnd', then:
      // webkitTransitionEnd
      // mozTransitionEnd
      // MSTransitionEnd
      // oTransitionEnd
      // transitionend
      element.on(pfx[p]+type, callback, false);
    }
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