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