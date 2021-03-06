/**
 * @usage
// Registor your Store.
StoreManager.register(ContactsStore, 'Contacts');

// Now create an instance.
var store = StoreManager.create('Contacts');

// Or
var store = StoreManager.create({
  ...,
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
   * @param {Store} s
   * @param {String} type
   */
  register (s, type) {
    this._stores[type] = s;
  }

  /**
   * Public.
   * @param {Object/String} config
   */
  create (config) {
    var s, type;

    if (typeof config === 'string') {
      type = config;
      config = undefined;
    } else {
      type = config.type;
    }

    s = this._stores[type];

    return new s(config);
  }

  /**
   * Public.
   * @param {Store} s
   */
  registerInstance (s) {
    var id = s.getId();
    this._instances[id] = s;
  }

  /**
   * Public.
   * @param {Store} s
   */
  unregisterInstance (s) {
    var id = s.getId();
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