/**
 * quackit.com/html_5/tags/html_input_tag.cfm
 */
class Field extends Component {

  /**
   * CONFIG
   * {Boolean} disabled
   * {String} inputType (mobileinputtypes.com) How input types modify a phones virtual keyboard.
   * {String} label
   * {Regular Expression} pattern
   * {Number} maxlength
   * {String} placeholder
   * {String} title
   * {Mixed} value
   */

  /**
   * Public.
   * @param {Boolean} disabled
   */
  setDisabled (disabled) {
    var oldValue = this.getConfig('disabled');

    if (disabled !== oldValue) {
      var dom = this._el.dom,
          inputDom;

      this._config.set('disabled', disabled);

      if (this._rendered) {
        inputDom = this._inputEl.dom;

        if (disabled) {
          Dom.addCls(dom, this.disabledCls);
          inputDom.setAttribute('disabled', 'disabled');
          inputDom.blur();
        } else {
          Dom.removeCls(dom, this.disabledCls);
          inputDom.removeAttribute('disabled');
        }
      }
    }
  }

  getDisabled () {
    return this.getConfig('disabled') || false;
  }

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
   * @param {Boolean} value
   */
  setPlaceholder (value) {
    var oldValue = this._config.get('placeholder'),
        dom;

    this._config.set('placeholder', value);

    if (this._rendered) {
      dom = this._inputEl.dom;

      if (value) {
        dom.setAttribute('placeholder', value);
      } else {
        dom.removeAttribute('placeholder');
      }
    }
  }

  /**
   * Public.
   * @param {String} value
   * @param {Boolean} forceValue (Optional) Internal use only.
   */
  setValue (value, forceValue) {
    var oldValue = this._config.get('value');

    this._config.set('value', value);

    if (forceValue || value !== oldValue) {
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
    this.disabledCls = 'smp-disabled';
    this.isField = true;
  }

  _getBaseCls () {
    return 'smp-field';
  }

  _getRenderTpl () {
    return '<div id="{id}" class="smp-field {cls}" style="{style}">' +
        '<span class="label">{label}</span>' +
        '<input class="input" {attributes} />' +
      '</div>';
  }

  _getInputAttributes () {
    var inputType = this.getConfig('inputType'),
        maxlength = this.getConfig('maxlength'),
        pattern = this.getConfig('pattern'),
        title = this.getConfig('title'),
        value = 'type="' + inputType + '"';

    if (maxlength) {
      value += ' maxlength="' + maxlength + '"';
    }

    if (pattern) {
      value += ' pattern="' + pattern + '"';
    }

    if (title) {
      value += ' title="' + title + '"';
    }

    return value;
  }

  /**
   * Private.
   */
  _getRenderData () {
    var data = super._getRenderData(),
        disabled = this.getConfig('disabled'),
        label = this.getConfig('label');

    if (typeof disabled === 'boolean') {
      this.setDisabled(disabled);
    }

    if (!label) {
      data.cls += ' ' + this._noLabelCls;
    }

    data.attributes = this._getInputAttributes();
    data.label = label;
    return data;
  }

  _onRender () {
    super._onRender();

    var labelDom = Dom.select('.label', this._el.dom)[0],
        inputDom = Dom.select('.input', this._el.dom)[0],
        placeholder = this.getConfig('placeholder'),
        value = this.getConfig('value');

    this._labelEl = new Element(labelDom);
    this._inputEl = new Element(inputDom);

    if (placeholder) {
      this.setPlaceholder(placeholder);
    }

    if (value) {
      this.setValue(value, true);
    }
  }

  /**
   * Private.
   */
  _initEvents () {
    super._initEvents();
    this._inputEl.on('change', this._onChange.bind(this));
    this._inputEl.on('input', this._onInput.bind(this));
  }

  /**
   * Private.
   */
  _onChange (event) {
    if (this.getDisabled()) {
      return;
    }

    var value = event.target.value;
    this._emit('change', this, value, event);
  }

  /**
   * Private.
   */
  _onInput (event) {
    if (this.getDisabled()) {
      return;
    }

    var value = event.target.value;
    this._emit('input', this, value, event);
  }

  _beforeDestroy () {
    super._beforeDestroy();
    this._labelEl.destroy();
    this._inputEl.destroy();
  }
}

ComponentManager.register(Field, 'field');