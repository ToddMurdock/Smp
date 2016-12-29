class MainController extends ViewController {
  onCardOneButtonClick (btn) {
    this.getViewModel().set('activeCard', 1);
  }

  onCardTwoButtonClick (btn) {
    this.getViewModel().set('activeCard', 2);
  }

  onWindowOneButtonClick () {
    let win = new Window({
      height: 300,
      items: [
        {
          flex: 1,
          items: [
            {
              label: 'First name',
              style: 'margin: 0.5em 0.5em 0.5em 0',
              type: 'textfield'
            },
            {
              label: 'Last name',
              style: 'margin: 0 0.5em 0.5em 0',
              type: 'textfield'
            }
          ],
          layout: {
            type: 'column'
          },
          type: 'container'
        },
        {
          items: [
            {
              flex: 1,
              type: 'component'
            },
            {
              handler: function () {
                win.close();
              },
              style: 'margin: 0.3em 0 0.3em 0',
              text: 'Ok',
              type: 'button'
            },
            {
              handler: function () {
                win.close();
              },
              style: 'border-left: 1px solid #0070ff; border-radius: 0; margin: 0.3em 0.3em 0.3em 0',
              text: 'Cancel',
              type: 'button'
            }
          ],
          layout: {
            type: 'row'
          },
          type: 'container'
        }
      ],
      layout: {
        type: 'column'
      },
      title: 'Profile',
      width: 400
    });

    win.show();
  }
}