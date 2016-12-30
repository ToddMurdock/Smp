class ContactsList extends List {
  constructor (config) {
    config.cls = 'contacts-list';
    config.id = 'Contacts';
    config.itemTpl = '<div id="{Id}">{LastName}, {FirstName}</div>';
    config.store = new ContactsStore();

    super(config);
  }
}

ComponentManager.register(ContactsList, 'contactslist');