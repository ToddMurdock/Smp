class SourceRegistry {
  constructor () {
    this._registry = [];
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
  register (config) {
    this._registry.push(config);
  }

  /**
   * Public.
   * @param {Component} source
   */
  unRegister (source) {
    var items = this._registry,
        len = items.length,
        i = 0,
        index;
    
    for (; i < len; i++) {
      if (items[i].source === source) {
        index = i;
        break;
      }
    }

    if (index !== undefined) {
      this._registry.splice(index, 1);
    }
  }

  /**
   * Public.
   * Search the registry for the source element that contains the drag target.
   * @param {TouchEvent} e
   */
  findDragSource (e) {
    var target = e.target,
        reg = this._registry,
        len = reg.length,
        i = 0,
        source, sourceEl;

    for (; i < len; i++) {
      source = reg[i].source;
      sourceEl = source.getEl();

      // Source element contains the drag target?
      if (sourceEl.contains(target)) {
        return reg[i];
      }
    }

    return undefined;
  }
}