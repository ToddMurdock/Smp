/**
 * @usage
let store = new Store(...);

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
   * {Store} store
   */

  /**
   * EVENTS
   * select
   */

  constructor (config) {
    config.baseCls = 'smp-list';
    super(config);

    this._store = this.getConfig('store');
    this.isList = true;
  }

  /**
   * Public.
   */
  getStore () {
    return this._store;
  }

  _onRender () {
    super._onRender();

    let store = this._store;

    if (store.isLoaded()) {
      this._renderItems(store.getRecords());
    } else {
      store.loadPage(1);
    }
  }

  _initEvents () {
    super._initEvents();

    this._el.on('click', this._onElClick.bind(this));
    this._el.on('scroll', this._onScroll.bind(this));

    this._store.on('datachange', this._onStoreDataChange.bind(this));
    this._store.on('load', this._onStoreLoad.bind(this));
  }

  /**
   * Private
   * @param {MouseEvent} event
   */
  _onElClick (event) {
    let target = event.target,
        cs = target.classList,
        index;

    if (cs.contains('list-item')) {
      index = this._indexOf(target);
      this._emit('select', this, this._store.getAt(index), index, event);
    }
  }

  /**
   * Private
   * @param {Event} event
   */
  _onScroll (e) {
    let dom = this._el.dom,
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
    let cn = this._getRenderedItems(),
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
    let items = this._getRenderedItems();
    return items[index];
  }

  /**
   * Private
   * @param {Store} store
   * @param {Model} record
   * @param {Object} change
   */
  _onStoreDataChange (store, record, change) {
    let index = store.indexOf(record),
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
    let dom = this._el.dom;

    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
  }

  /**
   * Private
   * @param {Model[]} records
   */
  _renderItems (records) {
    let me = this,
        el = me._el,
        template = new Template(),
        itemCls = this.getConfig('itemCls'),
        itemTpl = this.getConfig('itemTpl');

    records.forEach(function (record) {
      let itemEl = me._renderItem(template, itemCls, itemTpl, record.getData());
      el.appendChild(itemEl);
    });
  }

  _renderItem (template, itemCls, itemTpl, data) {
    let dom = Dom.create(template.apply(itemTpl, data)),
        list = dom.classList;

    list.add('list-item');

    if (itemCls) {
      list.add(itemCls);
    }

    return dom;
  }
}

ComponentManager.register(List, 'list');