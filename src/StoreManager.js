/**
 * @usage
// Registor your Store.
StoreManager.register(ContactsStore, 'ContactsStore');

// Now create an instance.
let win = StoreManager.create({
  type: 'ContactsStore'
});
 */
class StoreManager {
  constructor () {
    this._stores = {};
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
   * @param {Store} c
   * @param {String} type
   */
  register (c, type) {
    this._stores[type] = c;
  }

  /**
   * Public.
   * @param {Object} config
   */
  create (config) {
    let type = config.type,
        c = this._stores[type];

    return new c(config);
  }

  /**
   * Public.
   * @param {Store} c
   */
  registerInstance (c) {
    let id = c.getId();
    this._instances[id] = c;
  }

  /**
   * Public.
   * @param {Store} c
   */
  unregisterInstance (c) {
    let id = c.getId();
    delete this._instances[id];
  }

  /**
   * Public.
   * @param {String} id
   */
  getStore (id) {
    return this._instances[id];
  }
}

StoreManager = new StoreManager();