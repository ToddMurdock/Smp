class Button extends Component {

  /**
   * {Function} handler
   * {String} iconCls
   * {Object} scope
   * {String} text
   */

  constructor (config) {
    config.baseCls = 'smp-button';
    config.renderTpl = '<button type="button" id="{id}" class="{cls}" style="{style}"><span class="icon fa {iconCls}"></span> <span class="text">{text}</span></button>';

    super(config);
    this.isButton = true;
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
        let el = Dom.select('.icon', this._el.dom),
            cs = el.classList;

        if (oldValue) {
          cs.remove(oldValue);
        }

        if (!cs.contains(value)) {
          cs.add(value);
        }
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
   */
  _getRenderData () {
    let data = super._getRenderData(),
        configCls = this.getConfig('cls');

    if (configCls) {
      data.cls += ' ' + configCls;
    }

    data.iconCls = this.getConfig('iconCls') || '';
    data.text = this.getConfig('text');
    return data;
  }

  _initEvents () {
    super._initEvents();
    this._el.on('click', this._onClick.bind(this));
  }

  _onClick () {
    this._fireHandler();
  }

  _fireHandler () {
    let handler = this._getHandler();

    if (handler) {
      handler(this);
    }
  }

  _getHandler () {
    let handler = this.getConfig('handler');
    return this._binder.getHandler(handler);
  }
}

ComponentManager.register(Button, 'button');