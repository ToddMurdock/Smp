class Store {
  constructor (config) {
    this._config = new Config(config);

    this._data = undefined;
    this._event = new Event();

    this._page;
    this._pageSize = this.getConfig('pageSize') || 100;
    this._totalCount;
  }

  /**
   * Public
   * @param {String} key
   */
  getConfig (key) {
    return this._config.get(key);
  }

  /**
   * Public.
   */
  getData () {
    return this._data;
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

    return this._data.slice(begin, end);
  }

  /**
   * Public.
   * @param {Number} index
   */
  getAt (index) {
    return this.getData()[index];
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

  _onSearchComplete (response) {
    let data = this._processResponse(response);
    this._emit('load', this, data);
  }

  _processResponse (response) {
    let me = this,
        items = response.Items,
        data = (me._appendData ? me._data : []) || [],
        responseData = [],
        itemData;

    items.forEach(function (item) {
      itemData = me._processResponseItem(item);
      data.push(itemData);
      responseData.push(itemData);
    });

    me._data = data;
    me._totalCount = response.TotalCount;

    return responseData;
  }

  _onSearchFailed () {
    this._data = undefined;
    this._page = undefined;
    this._totalCount = 0;
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
}