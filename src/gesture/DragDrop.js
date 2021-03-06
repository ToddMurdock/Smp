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
   *   getDragData: ... {Function}
   *   source: ... {Component}
   * }
   */
  registerSource (config) {
    var source = config.source;

    if (Device.isDesktop()) {
      this._addDragListeners(source);
    } else {
      this._addTouchListeners(source);
    }

    this._sourceRegistry.register(config);
  }

  /**
   * Public.
   * @param {Component} source
   */
  unRegisterSource (source) {
    this._sourceRegistry.unRegister(source);
  }

  /**
   * Private.
   * @param {Component} source
   */
  _addDragListeners (source) {
    var el = source.getEl();

    this._boundOnDragStart = this._onDragStart.bind(this);
    el.on('dragstart', this._boundOnDragStart);
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
    var el = source.getEl();

    el.on('contextmenu', function (e) {
      e.preventDefault();
    });
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
    var target = config.target;

    if (Device.isDesktop()) {
      this._addDropListeners(target);
    }

    this._targetRegistry.register(config);
  }

  /**
   * Public.
   * @param {Component} target
   */
  unRegisterTarget (target) {
    this._targetRegistry.unRegister(target);
  }

  _addDropListeners (target) {
    var el = target.getEl();

    el.on('dragover', this._onDragOver.bind(this));
    el.on('drop', this._onDrop.bind(this));
  }

  _onDragOver (e) {
    if (this.isDragging) {
      this._callDragOverTarget(e);
    }
  }

  _callDragOverTarget (e) {
    var regItem = this._targetRegistry.findDropTarget(e),
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
    if (e.target.getAttribute('draggable')) {
      ////
      this._touchStartTime = new Date().getTime(); 
      this._touching = true;

      if (!this._delayedCheckTouchHold) {
        this._delayedCheckTouchHold = new DelayedTask(this._checkTouchHold, this);
      }

      this._delayedCheckTouchHold.delay(1000, undefined, undefined, [this._touchStartTime, e]);
      ////

      // this.isDragging = true;
      // this._callDragSource(e);
    }
  }

  ////
  _checkTouchHold (startTime, e) {
    if (!this._moving && this._touching && this._touchStartTime == startTime) {
      this._touchStartTime = 0;
      this._moving = undefined;
      this._onTouchHold(e);
    }
  }
  ////

  _onTouchHold (e) {
    e.preventDefault();
    this.isDragging = true;
    this._callDragSource(e);
  }

  /**
   * Private.
   * @param {TouchEvent} e
   */
  _onTouchMove (e) {
    this._moving = true;

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
    ////
    this._moving = undefined;
    this._touching = undefined;
    ////

    if (this.isDragging) {
      // Prevents scrolling during 'touchmove'
      e.preventDefault();

      if (this._ghost.isRendered()) {
        this._ghost.destroy();
      }

      this.isDragging = undefined;

      this._callDropTarget(e);
    }
  }

  /**
   * Private.
   * @param {TouchEvent} e
   */
  _callDragSource (e) {
    var regItem = this._sourceRegistry.findDragSource(e),
        source;

    if (regItem) {
      source = regItem.source;

      this._dragSource = source;
      this._dragData = regItem.getDragData.call(source, e);
    }
  }

  _callDropTarget (e) {
    var regItem = this._targetRegistry.findDropTarget(e),
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