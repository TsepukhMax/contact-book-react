import './contact-book.component.scss'
import React from 'react'
import ContactSearchComponent from '../contact-search/contact-search.component'
import ContactItemComponent from '../contact-item/contact-item.component'
import { useContacts } from '../../hooks/useContacts'

function ContactBookComponent() {
  const { shortContacts } = useContacts()

  return (
    <>
      <div className='container'>
        <div className='left-panel'>
          <ContactSearchComponent />
          {shortContacts.map(contact => (
            <ContactItemComponent
              key={contact.id}
              firstName={contact.firstName}
              lastName={contact.lastName}
              isSelected={false}
            />
          ))}
        </div>
  
        <div className='right-panel'>
        </div>
      </div>
    </>
  )
}

export default ContactBookComponent