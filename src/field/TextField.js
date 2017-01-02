/**
 * quackit.com/html_5/tags/html_input_tag.cfm
 */
class TextField extends Field {

  /**
   * @param {Object} config
   */
  constructor (config) {
    config.inputType = 'text';
    super(config);
  }
}

ComponentManager.register(TextField, 'textfield');