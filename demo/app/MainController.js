class MainController extends ViewController {
  onCardOneButtonClick (btn) {
    this.getViewModel().set('activeCard', 1);
  }

  onCardTwoButtonClick (btn) {
    this.getViewModel().set('activeCard', 2);
  }

  onSlideOutButtonClick () {
    new Sheet({
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
        type: 'column'
      },
      modal: true,
      side: 'left',
      style: 'max-width: 300px; width: 40%;',
      title: 'Slide Out Panel'
    }).show()
  }

  /**
   * @param {List} list
   * @param {Model} contact
   */
  onContactsListSelect (list, contact) {
    var win = new ContactWindow({
      contact: contact
    });

    win.show();
  }
}