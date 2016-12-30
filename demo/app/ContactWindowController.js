class ContactWindowController extends ViewController {
  onFirstNameChange (field, value) {
    this.getViewModel().set('firstName', value);
  }

  onLastNameChange (field, value) {
    this.getViewModel().set('lastName', value);
  }

  onOkClick () {
    let view = this.getView(),
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