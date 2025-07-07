import './contact-book.component.scss'
import React from 'react'
import ContactSearchComponent from '../contact-search/contact-search.component'
import ContactItemComponent from '../contact-item/contact-item.component'
import ContactDetailComponent from '../contact-detail/contact-detail.component'
import { useContacts } from '../../hooks/useContacts'

function ContactBookComponent() {
  const { shortContacts, selectedContact, selectContact } = useContacts()

  return (
    <div className='container'>
      <div className='left-panel'>
        <ContactSearchComponent />
        {shortContacts.map(contact => (
          <ContactItemComponent
            key={contact.id}
            firstName={contact.firstName}
            lastName={contact.lastName}
            isSelected={selectedContact?.id === contact.id}
            onClick={() => selectContact(contact.id)}
          />
        ))}
      </div>

      <div className='right-panel'>
        <ContactDetailComponent contact={selectedContact} />
      </div>
    </div>
  )
}

export default ContactBookComponent