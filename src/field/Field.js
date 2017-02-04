/**
 * quackit.com/html_5/tags/html_input_tag.cfm
 */
class Field extends Component {

  /**
   * CONFIG
   * {String} inputType (mobileinputtypes.com) How input types modify a phones virtual keyboard.
   * {String} label
   * {Mixed} value
   */

  /**
   * Public.
   * @param {String} value
   */
  setLabel (value) {
    var oldValue = this._config.get('label'),
        cls, el;

    this._config.set('label', value);

    if (value !== oldValue) {
      if (this._rendered) {
        cls = this._noLabelCls;
        el = this._el;

        if (value) {
          el.removeCls(cls);
        } else {
          el.addCls(cls);
        }

        this._labelEl.update(value);
      }

      this._publish('label', value);
    }
  }

  /**
   * Public.
   * @param {String} value
   */
  setValue (value) {
    var oldValue = this._config.get('value');

    this._config.set('value', value);

    if (value !== oldValue) {
      if (this._rendered) {
        this._inputEl.dom.value = value;
      }

      this._publish('value', value);
    }
  }

  /**
   * Public.
   */
  getValue () {
    return this._inputEl.dom.value;
  }

  /**
   * @param {Object} config
   */
  constructor (config) {
    super(config);

    this._noLabelCls = 'smp-field-no-label';
    this.isField = true;
  }

  _getBaseCls () {
    return 'smp-field';
  }

  _getRenderTpl () {
    return '<div id="{id}" class="smp-field smp-flex smp-flex-row {cls}" style="{style}">' +
        '<span class="label">{label}</span>' +
        '<input class="input smp-flex-row-item" type="{inputType}">' +
      '</div>';
  }

  /**
   * Private.
   */
  _getRenderData () {
    var data = super._getRenderData(),
        label = this.getConfig('label');

    if (!label) {
      data.cls += ' ' + this._noLabelCls;
    }

    data.inputType = this.getConfig('inputType');
    data.label = label;
    return data;
  }

  _onRender () {
    super._onRender();

    var labelDom = Dom.select('.label', this._el.dom)[0],
        inputDom = Dom.select('.input', this._el.dom)[0];

    this._labelEl = new Element(labelDom);
    this._inputEl = new Element(inputDom);
  }

  /**
   * Private.
   */
  _initEvents () {
    super._initEvents();
    this._inputEl.on('change', this._onChange.bind(this));
  }

  /**
   * Private.
   */
  _onChange (event) {
    var value = event.target.value;
    this._emit('change', this, value, event);
  }

  _beforeDestroy () {
    super._beforeDestroy();
    this._inputEl.destroy();
  }
}

ComponentManager.register(Field, 'field');