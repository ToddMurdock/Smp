/**
 * @usage
// Registor your component.
ComponentManager.register(ContactWindow, 'contactwindow');

// Now create an instance.
var win = ComponentManager.create({
  type: 'contactwindow'
});
 */
class ComponentManager {
  constructor () {
    this._components = {};
    this._instances = {};
  }

  /**
   * Public
   */
  id () {
    if (this._autoId === undefined) {
      this._autoId = 0;
    }

    return ++this._autoId;
  }

  /**
   * Public.
   * @param {Component} c
   * @param {String} type
   */
  register (c, type) {
    this._components[type] = c;
  }

  /**
   * Public.
   * @param {Object} config
   */
  create (config) {
    var type = config.type,
        c = this._components[type];

    return new c(config);
  }

  /**
   * Public.
   * @param {Component} c
   */
  registerInstance (c) {
    var id = c.getId();
    this._instances[id] = c;
  }

  /**
   * Public.
   * @param {Component} c
   */
  unregisterInstance (c) {
    var id = c.getId();
    delete this._instances[id];
  }

  /**
   * Public.
   * @param {String} id
   */
  getComponent (id) {
    return this._instances[id];
  }
}

ComponentManager = new ComponentManager();