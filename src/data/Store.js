class Store {

  /**
   * CONFIG
   * {Object} data
   * {String} id
   * {String} model
   */

  constructor (config) {
    this._config = new Config(config);
    this._event = new Event();

    this._id = this.getConfig('id') || StoreManager.id();
    this._isLoaded;
    this._isLoading;

    this._initData();
    StoreManager.registerInstance(this);
  }

  /**
   * Private.
   */
  _initData () {
    let data = this.getConfig('data');

    if (data) {
      this.loadData(data);
    }
  }

  /**
   * Public
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  getId () {
    return this._id;
  }

  getCount () {
    return this._records.length;
  }

  /**
   * Public.
   */
  getRecords () {
    return this._records;
  }

  /**
   * Public.
   * @param {Model} record
   */
  indexOf (record) {
    let i = 0,
        len = this._records.length;

    for (; i < len; i++) {
      if (this._records[i] === record) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Public.
   * @param {Number} index
   */
  getAt (index) {
    return this.getRecords()[index];
  }

  /**
   * Public.
   */
  isLoaded () {
    return this._isLoaded;
  }

  /**
   * Public.
   */
  isLoading () {
    return this._isLoading;
  }

  /**
   * Public.
   * @param {String} text
   */
  filter (text) {
    this.load({
      appendData: false,
      filter: text
    });
  }

  /**
   * Public.
   */
  clearFilter () {
    this.load({
      appendData: false
    });
  }

  /**
   * Public.
   * @param {Object} [options]
   */
  load (options) {
    options = options || {}

    if (options.filter) {
      // TODO: ajax call
    } else {
      // TODO: ajax cll
    }

    this._isLoading = true;
    this._currentLoadOptions = options;
  }

  /**
   * Public.
   * @param {Object[]} data
   * @param {Object} [options]
   */
  loadData (data, options) {
    this._currentLoadOptions = options || {};
    let records = this._processResponse({ Items: data, TotalCount: data.length });
    this._emit('load', this, records);
  }

  /**
   * Private.
   * @param {Object[]} data
   */
  _onLoadComplete (response) {
    let records = this._processResponse(response);
    this._isLoading = undefined;
    this._emit('load', this, records, this._currentLoadOptions);
  }

  /**
   * Private.
   * @param {Object} response
   * Example: { Items: [...] }
   */
  _processResponse (response) {
    let me = this,
        loadOptions = this._currentLoadOptions,
        items = response.Items,
        records = (loadOptions.appendData ? me._records : []) || [],
        responseData = [];

    items.forEach(function (item) {
      let record;

      record = new Model({
        data: me._processResponseItem(item),
        store: me
      });

      records.push(record);
      responseData.push(record);
    });

    me._isLoaded = true;
    me._records = records;

    return responseData;
  }

  /**
   * Private.
   * @param {Object} data
   */
  _processResponseItem (data) {
    return data;
  }

  _onLoadFailed () {
    this._isLoading = undefined;
    this._isLoaded = undefined;
    this._records = undefined;
  }

  /**
   * Private.
   * Called by Model.
   * @param {Model} record
   * @param {Object} change
   * Example:
   * {
   *   field: key,
   *   value: value,
   *   oldValue: oldValue
   * }
   */
  _onModelChange (record, change) {
    this._emit('datachange', this, record, change);
  }

  /**
   * Public
   * @param {String} label
   * @param {Function} callback
   */
  on (label, callback) {
    this._event.on(label, callback);
  }

  /**
   * Public
   * @param {String} label
   * @param {Function} callback
   */
  un (label, callback) {  
    return this._event.un(label, callback);
  }

  /**
   * Private
   * @param {String} label
   * @param {spread/rest} args
   */
  _emit (label, ...args) {  
    return this._event.emit(label, ...args);
  }

  /**
   * Private.
   * @param {Object} a
   * @param {Object} b
   */
  _apply (a, b) {
    a = a || {};

    for (let key in b) {
      a[key] = b[key];
    }

    return a;
  }

  /**
   * Public.
   */
  destroy () {
    StoreManager.unregisterInstance(this);
  }
}