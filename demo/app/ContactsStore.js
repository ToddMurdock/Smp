class ContactsStore extends Store {
  constructor () {
    super({
      data: [
        { FirstName: 'Todd', Id: 1, LastName: 'Murdock' },
        { FirstName: 'Bill', Id: 2, LastName: 'Smith' },
        { FirstName: 'John', Id: 3, LastName: 'Smith' },
        { FirstName: 'Abe', Id: 4, LastName: 'Lincoln' },
        { FirstName: 'Bill', Id: 5, LastName: 'Bradley' },
        { FirstName: 'George', Id: 3, LastName: 'Washington' }
      ]
    });
  }
}