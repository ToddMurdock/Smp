/**
 * TODO: look into polyfill
 * Polyfill that enables HTML5 drag drop support on mobile (touch) devices.
 * https://github.com/Bernardo-Castilho/dragdroptouch
 * https://www.npmjs.com/package/drag-drop-polyfill
 */

/**
 * https://mobiforge.com/design-development/html5-mobile-web-touch-events
 */

/**
 * @usage
DragDrop.registerSource({
  getDragData: function (e) {
    return ...;
  },
  source: this
});

DragDrop.registerTarget({
  canDrop: function (dragSource, dragData, e) {
    if (...) {
      return true;
    }

    return false;
  },
  onDrop: function (dragSource, dragData, e) {
    ...
  },
  target: this
});
 */
class DragDrop {
  constructor () {
    this.isDragging;
    this._ghost = new DragGhost();
    this._sourceRegistry = new SourceRegistry();
    this._targetRegistry = new TargetRegistry();
  }

  /**
   * Public.
   * @param {Object} config
   * Example:
   * {
   *   getDragDate: ... {Function}
   *   source: ... {Component}
   * }
   */
  registerSource (config) {
    let source = config.source;

    if (Device.isDesktop()) {
      this._addDragListeners(source);
    } else {
      this._addTouchListeners(source);
    }

    this._sourceRegistry.register(config);
  }

  /**
   * Private.
   * @param {Component} source
   */
  _addDragListeners (source) {
    let el = source.getEl();

    el.on('dragstart', this._onDragStart.bind(this));
    // el.on('drag', this._onDrag.bind(this));
    // el.on('dragend', this._onDragEnd.bind(this));
  }

  _onDragStart (e) {
    if (e.target.getAttribute('draggable')) {
      this.isDragging = true;
      this._callDragSource(e);
    }
  }

  // _onDrag (e) {}
  // _onDragEnd (e) {}

  /**
   * Private.
   * @param {Component} source
   */
  _addTouchListeners (source) {
    let el = source.getEl();

    el.on('touchstart', this._onTouchStart.bind(this));
    el.on('touchmove', this._onTouchMove.bind(this));
    el.on('touchend', this._onTouchEnd.bind(this));
  }

  /**
   * Public.
   * @param {Object} config
   * Example:
   * {
   *   canDrop: ... {Function}
   *   onDrop: ... {Function}
   *   target: ... {Component}
   * }
   */
  registerTarget (config) {
    let target = config.target;

    if (Device.isDesktop()) {
      this._addDropListeners(target);
    }

    this._targetRegistry.register(config);
  }

  _addDropListeners (target) {
    let el = target.getEl();

    el.on('dragover', this._onDragOver.bind(this));
    el.on('drop', this._onDrop.bind(this));
  }

  _onDragOver (e) {
    if (this.isDragging) {
      this._callDragOverTarget(e);
    }
  }

  _callDragOverTarget (e) {
    let regItem = this._targetRegistry.findDropTarget(e),
        canDropResult, dragEvent;

    if (regItem && regItem.canDrop) {
      dragEvent = e.changedTouches ? e.changedTouches[0] : e;
      canDropResult = regItem.canDrop.call(regItem.target, this._dragSource, this._dragData, dragEvent);

      if (Device.isDesktop() && canDropResult) {
        e.preventDefault();
      }
    }
  }

  _onDrop (e) {
    if (this.isDragging) {
      e.preventDefault();

      this.isDragging = undefined;
      this._callDropTarget(e);
    }
  }

  /**
   * Private.
   * @param {TouchEvent} e
   */
  _onTouchStart (e) {
    // if (e.target.getAttribute('draggable')) {
    //   // this._timeoutId = setTimeout(myFunction, 1000);
    //   this.delayedTouchMove = new DelayedTask(this._startTouchMove, this);
    //   this.delayedTouchMove.delay(750, undefined, undefined, [e]);
    // }

    if (e.target.getAttribute('draggable')) {
      // this.isDragging = true;
      this._callDragSource(e);
    }
  }

  // _startTouchMove (e) {
  //   this.isDragging = true;
  //   this._callDragSource(e);
  // }

  /**
   * Private.
   * @param {TouchEvent} e
   */
  _onTouchMove (e) {
    if (this.isDragging && !this._ghost.isRendered()) {
      this._ghost.render(e.target);
    }

    if (this.isDragging) {
      // Prevents scrolling during 'touchmove'
      e.preventDefault();

      this._ghost.position(e);
      this._callDragOverTarget(e);
    }
  }

  /**
   * Private.
   * @param {TouchEvent} e
   */
  _onTouchEnd (e) {
    if (this.isDragging) {
      // Prevents scrolling during 'touchmove'
      e.preventDefault();

      if (this._ghost.isRendered()) {
        this._ghost.destroy();
      }

      this.isDragging = undefined;

      this._callDropTarget(e);
    } // else {
    //   this.delayedTouchMove.cancel();
    // }
  }

  /**
   * Private.
   * @param {TouchEvent} e
   */
  _callDragSource (e) {
    let regItem = this._sourceRegistry.findDragSource(e),
        source;

    if (regItem) {
      source = regItem.source;

      this._dragSource = source;
      this._dragData = regItem.getDragData.call(source, e);
    }
  }

  _callDropTarget (e) {
    let regItem = this._targetRegistry.findDropTarget(e),
        dropEvent;

    if (regItem) {
      dropEvent = e.changedTouches ? e.changedTouches[0] : e;
      regItem.onDrop.call(regItem.target, this._dragSource, this._dragData, dropEvent);
    }
  }
}

Dom.onReady(function () {
  DragDrop = new DragDrop();
});