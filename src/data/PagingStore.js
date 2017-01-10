class PagingStore extends Store {

  /**
   * CONFIG
   * {Number} pageSize
   */

  constructor (config) {
    super(config);

    this._page;
    this._totalCount;
  }

  /**
   * Public.
   * Returns the data for the current page.
   */
  getPageRecords () {
    var page = this.getPage(),
        pageSize = this.getPageSize(),
        begin, end;

    if (page === 1) { begin = 0; }
    else { begin = (page - 1) * pageSize; }
    end = begin + pageSize;

    return this._records.slice(begin, end);
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
    return this.getConfig('pageSize') || 100;
  }

  /**
   * Public.
   */
  getTotalCount () {
    return this._totalCount;
  }

  /**
   * Override.
   * Public.
   * @param {String} text
   */
  filter (text) {
    this.loadPage(1, {
      appendData: false,
      filter: text
    });
  }

  /**
   * Override.
   * Public.
   */
  clearFilter () {
    this.loadPage(1, {
      appendData: false
    });
  }

  /**
   * Public.
   * @param {Object} [options]
   */
  nextPage (options) {
    this.loadPage(this.getPage() + 1, options);
  }

  /**
   * Public.
   * @param {Number} page
   * @param {Object} [options]
   */
  loadPage (page, options) {
    var size = this.getPageSize();

    this._page = page;

    options = this._apply(options, {
      limit: size,
      page: page,
      start: (page - 1) * size
    });

    this.load(options);
  }

  /**
   * Private.
   * @param {Object} response
   * Example: { Items: [...], TotalCount: 100 }
   */
  _processResponse (response) {
    this._totalCount = response.TotalCount;
    return super._processResponse(response);
  }

  /**
   * Private.
   */
  _onLoadFailed () {
    super._onLoadFailed();

    this._page = undefined;
    this._totalCount = 0;
  }
}