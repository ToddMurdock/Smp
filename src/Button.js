class Button extends Component {

  /**
   * {Function} handler
   * {String} iconCls
   * {Object} scope
   * {String} text
   * {String} toggleGroup
   */

  constructor (config) {
    config.baseCls = 'smp-button';
    config.renderTpl = '<button type="button" id="{id}" class="{cls}" style="{style}"><span class="icon {iconCls}"></span> <span class="text">{text}</span></button>';

    super(config);
    this.isButton = true;

    if (typeof config.toggleGroup === 'string' && config.toggleGroup !== '') {
      this.enableToggle = true;
    }

    this.allowDepress;
    this.pressed = config.pressed || undefined;
    this.pressedCls = 'smp-button-pressed';
    this.toggleDisabled;
  }

  /**
   * Public.
   * @param {String} value
   */
  setIconCls (value) {
    let oldValue = this._config.get('iconCls');

    if (value !== oldValue) {
      this._config.set('iconCls', value);

      if (this._rendered) {
        let el = Dom.select('.icon', this._el.dom);

        if (oldValue) {
          Dom.removeCls(el, oldValue);
        }

        Dom.addCls(el, value);
      }

      this._publish('iconCls', value);
    }
  }

  /**
   * Public.
   * @param {String} value
   */
  setText (value) {
    let oldValue = this._config.get('text');

    this._config.set('text', value);

    if (value !== oldValue) {
      if (this._rendered) {
        let el = Dom.select('.text', this._el.dom);
        el.innerHTML = value;
      }

      this._publish('text', value);
    }
  }

  /**
   * Override.
   * Private.
   */
  _getRenderData () {
    let data = super._getRenderData(),
        configCls = this.getConfig('cls'),
        iconCls = this.getConfig('iconCls') || '';

    if (configCls) {
      data.cls += ' ' + configCls;
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
    this._el.on('click', this._onClick.bind(this));
  }

  /**
   * Private.
   */
  _onClick () {
    if (this.enableToggle) {
      this._doToggle();
    } else {
      this._fireHandler();
    }
  }

  _doToggle () {
    // Do nothing if button is disabled
    if (this.toggleDisabled) { return; }

    if (this.enableToggle && (this.allowDepress !== false || !this.pressed)) {
      this.toggle();
    }
  }

  /**
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

        // if (this.toggleHandler) {
        //   this.toggleHandler.call(this.getConfig('scope') || this, this, state);
        // }
        this._fireHandler();
      }
    }

    return this;
  }

  /**
   * Private.
   */
  _fireHandler () {
    let handler = this._getHandler();

    if (handler) {
      handler.call(this.getConfig('scope') || this, this);
    }
  }

  /**
   * Private.
   */
  _getHandler () {
    let handler = this.getConfig('handler');
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