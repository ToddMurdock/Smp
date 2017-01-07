class SearchField extends Field {
  /**
   * CONFIG
   * {Store} store
   */

  /**
   * @param {Object} config
   */
  constructor (config) {
    config.inputType = 'search';
    super(config);
  }

  getStore () {
    let store = this.getConfig('store');

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
   * Override.
   * Private.
   */
  _onChange (event) {
    super._onChange(event);
    this._doFilter();
  }

  /**
   * Private.
   */
  _doFilter () {
    if (!this._delayedFilter) {
      this._delayedFilter = new DelayedTask(this._doDelayedFilter, this);
    }

    this._delayedFilter.delay(350);
  }

  /**
   * Private.
   */
  _doDelayedFilter () {
    var store = this.getStore(),
        value = this.getValue();

    if (!value) {
      store.clearFilter();
    } else {
      store.filter(value);
    }
  }
}

ComponentManager.register(SearchField, 'searchfield');