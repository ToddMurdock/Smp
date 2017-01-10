class TargetRegistry {
  constructor () {
    this._registry = [];
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
  register (config) {
    this._registry.push(config);
  }

  /**
   * Public.
   * @param {TouchEvent} e
   * @return {Object}
   */
  findDropTarget (e) {
    var reg = this._registry,
        len = reg.length,
        i = 0,
        target;

    for (; i < len; i++) {
      target = reg[i].target;

      if (this._isDropInTarget(target, e)) {
        return reg[i];
      }
    }

    return undefined;
  }

  /**
   * Private.
   * Returns true if the event is within the Component's box.
   * @param {Component} target
   * @param {DragEvent/TouchEvent} e
   */
  _isDropInTarget (target, e) {
    var event = e.changedTouches ? e.changedTouches[0] : e,
        x = event.clientX,
        y = event.clientY,
        box = target.getBox();

    if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) {
      return true;
    }

    return false;
  }
}