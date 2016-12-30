class MainController extends ViewController {
  onCardOneButtonClick (btn) {
    this.getViewModel().set('activeCard', 1);
  }

  onCardTwoButtonClick (btn) {
    this.getViewModel().set('activeCard', 2);
  }

  /**
   * @param {List} list
   * @param {Model} contact
   */
  onContactsListSelect (list, contact) {
    let win = new ContactWindow({
      contact: contact
    });

    win.show();
  }
}