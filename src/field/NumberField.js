class NumberField extends Field {

  /**
   * CONFIG
   * {Number} max
   * {Number} min
   * {Number} step
   */

  /**
   * @param {Object} config
   */
  constructor (config) {
    config.inputType = 'number';
    super(config);
  }

  _getInputAttributes () {
    var attributes = super._getInputAttributes(),
        max = this.getConfig('max'),
        min = this.getConfig('min'),
        step = this.getConfig('step');

    if (!isNaN(max)) {
      attributes += ' max="' + max + '"';
    }

    if (!isNaN(min)) {
      attributes += ' min="' + min + '"';
    }

    if (!isNaN(step)) {
      attributes += ' step="' + step + '"';
    }

    return attributes;
  }
}

ComponentManager.register(NumberField, 'numberfield');