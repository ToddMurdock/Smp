class Button extends Component {

  /**
   * {Boolean} allowDepress
   * {Boolean} disabled
   * {Function} handler
   * {String} iconCls
   * {Boolean} pressed
   * {Boolean} repeat
   * {Object} scope
   * {String} text
   * {String} toggleGroup
   */

  /**
   * Public.
   * @param {Boolean} disabled
   */
  setDisabled (disabled) {
    var oldValue = this.getConfig('disabled');

    if (disabled !== oldValue) {
      var dom = this._el.dom;

      this._config.set('disabled', disabled);

      if (this._rendered) {
        if (disabled) {
          Dom.addCls(dom, this.disabledCls);
        } else {
          Dom.removeCls(dom, this.disabledCls);
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
  setIconCls (value) {
    var oldValue = this._config.get('iconCls');

    if (value !== oldValue) {
      this._config.set('iconCls', value);

      if (this._rendered) {
        var dom = Dom.select('.icon', this._el.dom)[0];

        if (oldValue) {
          Dom.removeCls(dom, oldValue);
        }

        Dom.addCls(dom, value);
      }

      this._publish('iconCls', value);
    }
  }

  /**
   * Public.
   * @param {String} value
   */
  setText (value) {
    var oldValue = this._config.get('text');

    this._config.set('text', value);

    if (value !== oldValue) {
      if (this._rendered) {
        var dom = Dom.select('.text', this._el.dom)[0];
        dom.innerHTML = value;
      }

      this._publish('text', value);
    }
  }

  /**
   * Public
   * If a state it passed, it becomes the pressed state otherwise the current state is toggled.
   * @param {Boolean} [state] Force a particular state
   * @param {Boolean} [suppressEvent=false] True to stop events being fired when calling this method.
   * @return {Ext.button.Button} this
   */
  toggle (state, suppressEvent) {
    state = state === undefined ? !this.pressed : !!state;

    if (state !== this.pressed) {
      if (this._rendered) {
        this[state ? 'addCls' : 'removeCls'](this.pressedCls);
      }

      this.pressed = state;

      if (!suppressEvent) {
        this._emit('toggle', this, state);
        this._fireHandler();
      }
    }

    return this;
  }

  /**
   * Private.
   * @param {Object} [config]
   */
  constructor (config) {
    super(config);

    this.isButton = true;

    var toggleGroup = this.getConfig('toggleGroup'),
        pressed = this.getConfig('pressed');

    if (typeof toggleGroup === 'string' && toggleGroup !== '') {
      this.enableToggle = true;
    }

    this.disabledCls = 'smp-disabled';
    this.pressed = pressed;
    this.pressedCls = 'smp-button-pressed';
    this.toggleDisabled;
  }

  _getBaseCls () {
    return 'smp-button';
  }

  _getRenderTpl () {
    return '<button type="button" id="{id}" class="{cls}" style="{style}"><span class="icon {iconCls}"></span> <span class="text">{text}</span></button>';
  }

  /**
   * Override.
   * Private.
   */
  _getRenderData () {
    var data = super._getRenderData(),
        cls = this.getConfig('cls'),
        disabled = this.getConfig('disabled'),
        iconCls = this.getConfig('iconCls') || '';

    if (cls) {
      data.cls += ' ' + cls;
    }

    if (disabled) {
      data.cls += ' ' + this.disabledCls;
    }

    if (this.pressed) {
      data.cls += ' ' + this.pressedCls;
    }

    data.iconCls = iconCls;
    data.text = this.getConfig('text');
    return data;
  }

  /**
   * Override.
   * Private.
   */
  _onRender () {
    super._onRender();
    ButtonManager.register(this);
  }

  /**
   * Override.
   * Private.
   */
  _initEvents () {
    super._initEvents();

    if (this.getConfig('repeat')) {
      new ClickRepeater({
        el: this._el,
        handler: this._onClick.bind(this)
      });
    } else {
      this._el.on('click', this._onClick.bind(this));
    }
  }

  /**
   * Private.
   */
  _onClick () {
    if (this.getDisabled()) {
      return;
    }

    if (this.enableToggle) {
      this._doToggle();
    } else {
      this._fireHandler();
    }
  }

  _doToggle () {
    var allowDepress = this.getConfig('allowDepress');

    // Do nothing if button is disabled
    if (this.toggleDisabled) { return; }

    if (this.enableToggle && (allowDepress !== false || !this.pressed)) {
      this.toggle();
    }
  }

  /**
   * Private.
   */
  _fireHandler () {
    var handler = this._getHandler();

    if (handler) {
      handler.call(this.getConfig('scope') || this, this);
    }
  }

  /**
   * Private.
   */
  _getHandler () {
    var handler = this.getConfig('handler');
    return this._binder.getHandler(handler);
  }

  /**
   * Override.
   * Private.
   */
  _beforeDestroy () {
    super._beforeDestroy();
    ButtonManager.unregister(this);
  }
}

ComponentManager.register(Button, 'button');