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
              html: 'Card 2',
              type: 'component'
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
          iconCls: 'fa-id-card-o',
          text: 'Card 1',
          type: 'button'
        },
        {
          handler: 'onCardTwoButtonClick',
          iconCls: 'fa-id-card',
          text: 'Card 2',
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