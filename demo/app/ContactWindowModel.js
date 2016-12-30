class ContactWindowModel extends ViewModel {
  constructor () {
    super({
      data: {
        contact: undefined,

        firstName: undefined,
        firstNameLabel: 'First name',
        lastName: undefined,
        lastNameLabel: 'Last name'
      }
    });
  }
}