/**
 * @usage
var store = new Store(...);

{
  itemCls: 'thumb',
  itemTpl: '<div id="{Id}" style="background-image:url({ Doc.getThumb(DocModel, { height: 50, width: 50 }) });height:50px;width:50px;" title="{Name}"></div>',
  listeners: {
    select: function (list, data) {
      app.importDoc(data.Id);
    }
  },
  store: store,
  style: 'overflow:auto',
  type: 'list'
}
 */
class List extends Component {

  /**
   * CONFIGS
   * {String} itemCls
   * {String} itemTpl
   * {String/Store} store A {Store} instance or the id of a store instance registered with {StoreManager}.
   */

  /**
   * EVENTS
   * select
   */

  /**
   * Public.
   */
  getStore () {
    var store = this.getConfig('store');

    if (typeof store === 'string') {
      store = StoreManager.getStore(store);

      if (store) {
        this._config.set('store', store);
      }
    }

    return store;
  }

  /**
   * Private.
   * @param {Object} config
   */
  constructor (config) {
    super(config);
    this.isList = true;
  }

  _getBaseCls () {
    return 'smp-list';
  }

  _onRender () {
    super._onRender();

    var store = this.getStore();

    if (store.isLoaded()) {
      this._renderItems(store.getRecords());
    } else {
      store.loadPage(1);
    }
  }

  _initEvents () {
    var store = this.getStore();

    super._initEvents();

    this._el.on('click', this._onElClick.bind(this));
    this._el.on('scroll', this._onScroll.bind(this));

    store.on('datachange', this._onStoreDataChange.bind(this));
    store.on('load', this._onStoreLoad.bind(this));
  }

  /**
   * Private
   * @param {MouseEvent} event
   */
  _onElClick (event) {
    var target = event.target,
        cs = target.classList,
        index;

    if (cs.contains('list-item')) {
      index = this._indexOf(target);
      this._emit('select', this, this.getStore().getAt(index), index, event);
    }
  }

  /**
   * Private
   * @param {Event} event
   */
  _onScroll (e) {
    var dom = this._el.dom,
        pad = 10;

    // scrollTop refers to the top of the scroll position, which will be scrollHeight - offsetHeight
    if ((dom.scrollTop + pad) >= (dom.scrollHeight - dom.offsetHeight)) {
      this._onScrollEnd(e);
    }

    // if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
    //   this._onScrollEnd(e);
    // }
  }

  _onScrollEnd (e) {
    this._emit('scrollend', this, e);
  }

  _getRenderedItems () {
    return this._el.dom.getElementsByClassName('list-item');
  }

  /**
   * Private
   * @param {HTMLElement} target
   */
  _indexOf (target) {
    var cn = this._getRenderedItems(),
        i = 0,
        len = cn.length;

    for (i; i < len; i++) {
      if (cn[i] === target) {
        return i;
      }
    }

    return undefined;
  }

  /**
   * Private
   * @param {Number} index
   */
  _getAt (index) {
    var items = this._getRenderedItems();
    return items[index];
  }

  /**
   * Private
   * @param {Store} store
   * @param {Model} record
   * @param {Object} change
   */
  _onStoreDataChange (store, record, change) {
    var index = store.indexOf(record),
        el = this._getAt(index),
        itemCls, itemTpl, newEl, template;

    if (el) {
      template = new Template();
      itemCls = this.getConfig('itemCls');
      itemTpl = this.getConfig('itemTpl');
      newEl = this._renderItem(template, itemCls, itemTpl, record.getData());

      el.parentNode.replaceChild(newEl, el);
    }
  }

  /**
   * Private
   * @param {Store} store
   * @param {Model[]} records
   * @param {Object} loadOptions
   */
  _onStoreLoad (store, records, loadOptions) {
    if (loadOptions && !loadOptions.appendData) {
      this._removedRenderedItems();
    }

    if (records.length > 0) {
      this._renderItems(records);
    }

    else if (store.getCount() === 0) {
      this._removedRenderedItems();
    }
  }

  _removedRenderedItems () {
    var dom = this._el.dom;

    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
  }

  /**
   * Private
   * @param {Model[]} records
   */
  _renderItems (records) {
    var me = this,
        el = me._el,
        template = new Template(),
        itemCls = this.getConfig('itemCls'),
        itemTpl = this.getConfig('itemTpl');

    records.forEach(function (record) {
      var itemEl = me._renderItem(template, itemCls, itemTpl, record.getData());
      el.appendChild(itemEl);
    });
  }

  _renderItem (template, itemCls, itemTpl, data) {
    var dom = Dom.create(template.apply(itemTpl, data)),
        list = dom.classList;

    list.add('list-item');

    if (itemCls) {
      list.add(itemCls);
    }

    return dom;
  }
}

ComponentManager.register(List, 'list');