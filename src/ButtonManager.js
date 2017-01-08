class ButtonManager {

  constructor () {
    this._groups = {};
  }

  _onToggle (btn, state) {
    if (state) {
      var toggleGroup = btn.getConfig('toggleGroup'),
          g = this._groups[toggleGroup],
          length = g.length,
          i;

      for (i = 0; i < length; i++) {
        if (g[i] !== btn) {
          g[i].toggle(false);
        }
      }
    }
  }

  register (btn) {
    var toggleGroup = btn.getConfig('toggleGroup'),
        group;

    if (!toggleGroup) {
      return;
    }

    group = this._groups[toggleGroup];

    if (!group) {
      group = this._groups[toggleGroup] = [];
    }

    group.push(btn);

    this._boundOnToggle = this._onToggle.bind(this);
    btn.on('toggle', this._boundOnToggle);
  }

  unregister (btn) {
    var toggleGroup = btn.getConfig('toggleGroup');

    if (!toggleGroup) {
      return;
    }

    var group = this._groups[toggleGroup],
        index;

    if (group) {
      index = array.indexOf(btn);

      if (index > -1) {
        group.splice(index, 1);
        btn.un('toggle', this._boundOnToggle);
      }
    }
  }

  // Gets the pressed button in the passed group or null
  // @param {String} group
  // @return {Button}
  getPressed (group) {
    var g = this._groups[group],
        i = 0,
        len;

    if (g) {
      for (len = g.length; i < len; i++) {
        if (g[i].pressed === true) {
          return g[i];
        }
      }
    }

    return null;
  }
}

ButtonManager = new ButtonManager();