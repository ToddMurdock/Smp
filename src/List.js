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
    this._store.loadPage(1);
  }

  _initEvents () {
    super._initEvents();

    this._el.on('click', this._onElClick.bind(this));
    this._el.on('scroll', this._onScroll.bind(this));

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
    let dom = this._el.dom;

    if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
      this._onScrollEnd(e);
    }
  }

  _onScrollEnd (e) {
    this._emit('scrollend', this, e);
  }

  /**
   * Private
   * @param {HTMLElement} target
   */
  _indexOf (target) {
    let cn = this._el.dom.getElementsByClassName('list-item'),
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
   * @param {Store} store
   * @param {Object[]} data
   */
  _onStoreLoad (store, data) {
    this._renderItems(data);
  }

  /**
   * Private
   * @param {Object[]} data
   */
  _renderItems (data) {
    let el = this._el,
        template = new Template(),
        itemCls = this.getConfig('itemCls'),
        itemTpl = this.getConfig('itemTpl');

    data.forEach(function (item) {
      let itemEl = Dom.create(template.apply(itemTpl, item)),
          classList = itemEl.classList;

      classList.add('list-item');

      if (itemCls) {
        classList.add(itemCls);
      }

      el.appendChild(itemEl);
    });
  }
}

ComponentManager.register(List, 'list');