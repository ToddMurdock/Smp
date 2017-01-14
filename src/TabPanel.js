class TabPanel extends Component {

  /**
   * CONFIG
   * {Number} activeItem
   * {Component[]} items
   * {String} tabPosition (left, top)
   */

  /**
   * Private.
   */
  constructor (config) {
    config.data = undefined;
    config.html = undefined;
    config.tabPosition = config.tabPosition || 'top';
    config.tpl = undefined;
    super(config);

    this.isTabPanel = true;
  }

  _getBaseCls () {
    return 'smp-tabpanel';
  }

  /**
   * Private.
   */
  _onRender () {
    super._onRender();

    this._renderTabBar();
    this._renderBody();
    this._doLayout();
  }

  _doLayout () {
    var tabPosition = this.getConfig('tabPosition'),
        bodyCls = 'smp-tab-body',
        elCls = 'smp-flex';

    if (tabPosition === 'top' || tabPosition === 'bottom') {
      bodyCls += ' smp-flex-column-item';
      elCls += ' smp-flex-column';
    } else {
      bodyCls += ' smp-flex-row-item';
      elCls += ' smp-flex-row';
    }

    this._tabBody.addCls(bodyCls);
    this._el.addCls(elCls);
  }

  /**
   * Private.
   */
  _renderTabBar () {
    var me = this,
        activeItem = (this.getConfig('activeItem') ||  1) - 1,
        tabPosition = this.getConfig('tabPosition'),
        items = me.getConfig('items'),
        buttons = [];

    items.forEach(function (comp, index) {
      var baseCfg = {
            handler: me._onTabClick,
            pressed: activeItem === index,
            scope: me,
            toggleGroup: me.getId() + '-tabs',
            type: 'button'
          },
          tabCfg = comp.tabConfig,
          cfg = tabCfg ? tabCfg : (comp.title ? { text: comp.title } : undefined);

      Object.assign(cfg, baseCfg);

      buttons.push(cfg);
    });

    me._tabBar = new Container({
      cls: 'smp-tab-bar',
      items: buttons,
      layout: {
        type: (tabPosition === 'top' || tabPosition === 'bottom') ? 'row' : 'column'
      },
      renderTo: me._el
    });

    me._tabBar.render();
  }

  _onTabClick (btn) {
    if (btn.pressed === true) {
      var index = this._indexOfTab(btn);

      if (!isNaN(index)) {
        this._tabBody.setActiveItem(index + 1);
      }
    }
  }

  _indexOfTab (btn) {
    var btns = this._tabBar.getLayoutItems(),
        len = btns.length,
        i = 0;

    for (; i < len; i++) {
      if (btns[i] === btn) {
        return i;
      }
    }

    return undefined;
  }

  _renderBody () {
    this._tabBody = new Container({
      activeItem: this.getConfig('activeItem') ||  1,
      items: this.getConfig('items'),
      layout: {
        type: 'card'
      },
      renderTo: this._el
    });

    this._tabBody._owner = this;
    this._tabBody.render();
  }

  /**
   * Private.
   */
  _beforeDestroy () {
    this._tabBar.destroy();
    this._tabBody.destroy();
    super._beforeDestroy();
  }
}

ComponentManager.register(TabPanel, 'tabpanel');