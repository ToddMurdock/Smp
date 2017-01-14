class ContactWindow extends Window {

  /**
   * CONFIG
   * {Object} contact
   */

  constructor (config) {
    // TODO: Mobile friendly
    var isDesktop = Device.isDesktop();

    super({
      fullscreen: !isDesktop,
      height: isDesktop ? 300 : undefined,
      items: [
        {
          flex: 1,
          items: [
            {
              bind: {
                label: 'firstNameLabel',
                value: 'firstName'
              },
              listeners: {
                change: 'onFirstNameChange'
              },
              style: 'margin: 0.5em 0.5em 0.5em 0',
              type: 'textfield'
            },
            {
              bind: {
                label: 'lastNameLabel',
                value: 'lastName'
              },
              listeners: {
                change: 'onLastNameChange'
              },
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
              handler: 'onOkClick',
              style: 'margin: 0.3em 0 0.3em 0',
              text: 'Ok',
              type: 'button'
            },
            {
              handler: 'onCancelClick',
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
      modal: true,
      title: 'Edit Contact',
      viewController: new ContactWindowController(),
      viewModel: new ContactWindowModel(),
      width: isDesktop ? 400 : undefined
    });

    this.contact = config.contact;
  }
}