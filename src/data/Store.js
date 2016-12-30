class Store {

  /**
   * CONFIG
   * {Object} data
   * {String} id
   * {String} model
   * {Number} pageSize
   */

  constructor (config) {
    this._config = new Config(config);
    this._event = new Event();

    this._id = this.getConfig('id') || StoreManager.id();
    this._isLoaded;
    this._page;
    this._pageSize = this.getConfig('pageSize') || 100;
    this._totalCount;

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
   * Returns the data for the current page.
   */
  getPageData () {
    let page = this.getPage(),
        pageSize = this.getPageSize(),
        begin, end;

    if (page === 1) { begin = 0; }
    else { begin = (page - 1) * pageSize; }
    end = begin + pageSize;

    return this._records.slice(begin, end);
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
  getPage () {
    return this._page;
  }

  /**
   * Public.
   */
  getPageSize () {
    return this._pageSize;
  }

  /**
   * Public.
   */
  getTotalCount () {
    return this._totalCount;
  }

  /**
   * Public.
   */
  load (options) {
    // TODO
    // ajax call
  }

  /**
   * Public.
   */
  nextPage (options) {
    this._appendData = undefined;

    if (options && options.appendData) {
      this._appendData = true;
    }

    this.loadPage(this.getPage() + 1, options);
  }

  /**
   * Public.
   * @param {Number} page
   */
  loadPage (page, options) {
    this._page = page;
    this.load(options);
  }

  /**
   * Public.
   * @param {Object[]} data
   */
  loadData (data, options) {
    this._appendData = undefined;

    if (options && options.appendData) {
      this._appendData = true;
    }

    let records = this._processResponse({ Items: data, TotalCount: data.length });
    this._emit('load', this, records);
  }

  /**
   * Private.
   * @param {Object[]} data
   */
  _onLoadComplete (response) {
    let records = this._processResponse(response);
    this._emit('load', this, records);
  }

  /**
   * Private.
   * @param {Object} response
   * Example: { Items: [...], TotalCount: 100 }
   */
  _processResponse (response) {
    let me = this,
        items = response.Items,
        records = (me._appendData ? me._records : []) || [],
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
    me._totalCount = response.TotalCount;

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
    this._isLoaded = undefined;
    this._records = undefined;
    this._page = undefined;
    this._totalCount = 0;
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
   * Public.
   */
  destroy () {
    StoreManager.unregisterInstance(this);
  }
}