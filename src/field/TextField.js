/**
 * quackit.com/html_5/tags/html_input_tag.cfm
 */
class TextField extends Component {

  /**
   * CONFIG
   * label
   */

  /**
   * @param {Object} config
   */
  constructor (config) {
    config.baseCls = 'smp-textfield';
    config.renderTpl = '<div id="<%=id%>" class="smp-flex smp-flex-row <%=cls%>" style="{style}"><span class="label"><%=label%></span><input class="field smp-flex-column-item" type="text" name="firstname"></div>';
    super(config);

    this.isField = true;
  }

  _getRenderData () {
    let data = super._getRenderData();

    data.label = this.getConfig('label');
    return data;
  }

  _initEvents () {
    let field;

    super._initEvents();

    field = Dom.select('.field', this._el.dom);
    Dom.on(field, 'change', this._onChange.bind(this));
  }

  _onChange (event) {
    let value = event.target.value;
    this._emit('change', this, value, event);
  }

  /**
   * Public.
   * @param {String} value
   */
  setLabel (value) {
    let oldValue = this._config.get('label');

    this._config.set('label', value);

    if (value !== oldValue) {
      if (this._rendered) {
        let el = Dom.select('.label', this._el.dom);
        el.innerHTML = value;
      }

      this._publish('label', value);
    }
  }
}

ComponentManager.register(TextField, 'textfield');