class SearchField extends Field {

  /**
   * CONFIG
   * {Boolean} incremental
   * {Store} store
   */

  /**
   * Public.
   * @param {Boolean} value
   */
  setIncremental (value) {
    var oldValue = this._config.get('incremental'),
        dom;

    this._config.set('incremental', value);

    if (this._rendered) {
      dom = this._inputEl.dom;

      if (value) {
        dom.setAttribute('incremental', 'incremental');
      } else {
        dom.removeAttribute('incremental');
      }
    }
  }

  /**
   * Public.
   */
  doFilter () {
    var store = this.getStore(),
        value = this.getValue();

    if (!value) {
      store.clearFilter();
    } else {
      store.filter(value);
    }
  }

  /**
   * Public.
   */
  getStore () {
    var store = this.getConfig('store');

    if (typeof store === 'string') {
      store = StoreManager.getStore(store);

      if (store) {
        this._config.set('store', store);
        return store;
      }
    }

    return store;
  }

  /**
   * @param {Object} config
   */
  constructor (config) {
    config.inputType = 'search';
    super(config);
  }

  _onRender () {
    super._onRender();

    var incremental = this.getConfig('incremental');

    if (incremental) {
      this.setIncremental(incremental);
    }
  }

  /**
   * Private.
   */
  _initEvents () {
    super._initEvents();
    this._inputEl.on('search', this._onSearch.bind(this));
  }

  /**
   * Private.
   */
  _onSearch (event) {
    var value = event.target.value;

    this._doFilter();
    this._emit('search', this, value, event);
  }

  /**
   * Private.
   */
  _doFilter () {
    if (!this._delayedFilter) {
      this._delayedFilter = new DelayedTask(this.doFilter, this);
    }

    this._delayedFilter.delay(350);
  }
}

ComponentManager.register(SearchField, 'searchfield');