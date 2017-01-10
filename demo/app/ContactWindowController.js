class ContactWindowController extends ViewController {

  /**
   * @param {ContactWindow} view
   */
  init (view) {
    var vm = this.getViewModel(),
        contact = view.contact;

    vm.set('contact', contact);
    vm.set('firstName', contact.get('FirstName'));
    vm.set('lastName', contact.get('LastName'));
  }

  /**
   * @param {TextField} field
   * @param {String} value
   */
  onFirstNameChange (field, value) {
    this.getViewModel().set('firstName', value);
  }

  /**
   * @param {TextField} field
   * @param {String} value
   */
  onLastNameChange (field, value) {
    this.getViewModel().set('lastName', value);
  }

  onOkClick () {
    var view = this.getView(),
        vm = this.getViewModel(),
        contact = vm.get('contact');

    contact.set('FirstName', vm.get('firstName'));
    contact.set('LastName', vm.get('lastName'));

    view.close();
  }

  onCancelClick () {
    this.getView().close();
  }
}