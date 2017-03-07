class TextAreaField extends Field {

  /**
   * CONFIG
   * {Number} cols
   * {Number} rows
   */

  _getRenderTpl () {
    return '<div id="{id}" class="smp-field {cls}" style="{style}">' +
        '<span class="label">{label}</span>' +
        '<textarea class="input" cols="{cols}" rows="{rows}"></textarea>' +
      '</div>';
  }

  /**
   * Private.
   */
  _getRenderData () {
    var data = super._getRenderData();

    data.cols = this.getConfig('cols') || 20;
    data.rows = this.getConfig('rows') || 4;

    return data;
  }
}

ComponentManager.register(TextAreaField, 'textareafield');