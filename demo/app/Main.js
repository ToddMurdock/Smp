class View {
  constructor () {
    this._init();
  }

  _init () {
    this._view = new Container({
      fullscreen: true,
      items: [
        this._configToolbar(),
        {
          bind: {
            activeItem: 'activeCard'
          },
          flex: 1,
          items: [
            {
              html: 'Card 1',
              type: 'component'
            },
            {
              // bodyStyle: 'padding: 1em',
              // html: 'Content here...',
              items: [
                {
                  flex: 1,
                  html: 'Item 1',
                  style: 'background-color: #f1f1f1; padding: 1em',
                  type: 'component'
                },
                {
                  flex: 1,
                  html: 'Item 2',
                  style: 'background-color: #d0d0d0; padding: 1em',
                  type: 'component'
                }
              ],
              layout: {
                type: 'row'
              },
              title: 'Card 2',
              type: 'panel'
            }
          ],
          layout: {
            type: 'card'
          },
          type: 'container'
        }
      ],
      layout: {
        type: 'column'
      },
      viewController: new MainController(),
      viewModel: new MainModel(),
      renderTo: document.body,
    });

    this._view.render();
  }

  _configToolbar () {
    return {
      cls: 'toolbar',
      items: [
        {
          handler: 'onCardOneButtonClick',
          iconCls: 'fa fa-id-card-o',
          text: 'Card 1',
          type: 'button'
        },
        {
          handler: 'onCardTwoButtonClick',
          iconCls: 'fa fa-id-card',
          text: 'Card 2',
          type: 'button'
        },
        {
          handler: 'onWindowOneButtonClick',
          iconCls: 'fa fa-window-maximize',
          text: 'Window 1',
          type: 'button'
        }
      ],
      layout: {
        type: 'row'
      },
      type: 'container'
    };
  }
}

Dom.onReady(function () {
  new View();
});