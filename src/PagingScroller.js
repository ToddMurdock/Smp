class PagingScroller {

  /**
   * @param {List} list
   */
  constructor (list) {
    this._list = list;
    this._loading = false;
    this._init();
  }

  _init () {
    let list = this._list,
        store = list.getStore();

    list.on('scrollend', this.onScrollEnd.bind(this));
    store.on('load', this.onStoreLoad.bind(this));
  }

  onStoreLoad (store) {
    this._loading = undefined;

    // if (this.currentScrollToTopOnRefresh !== undefined) {
    //   this.getDataView().setScrollToTopOnRefresh(this.currentScrollToTopOnRefresh);
    //   delete this.currentScrollToTopOnRefresh;
    // }
  }

  onScrollEnd (scroller, x, y) {
    var list = this._list;

    // if (!this._loading && y >= scroller.getMaxUserPosition().y) {
    //   this.currentScrollToTopOnRefresh = list.getScrollToTopOnRefresh();
    //   list.setScrollToTopOnRefresh(false);

      this.loadNextPage();
    // }
  }

  _storeFullyLoaded () {
    var store = this._list.getStore(),
        total = store.getTotalCount();

    return total !== null ? store.getTotalCount() <= (store.getPage() * store.getPageSize()) : false;
  }
 
  loadNextPage () {
    if (!this._storeFullyLoaded()) {
      this._loading = true;
      this._list.getStore().nextPage({ appendData: true });
    }
  }
}