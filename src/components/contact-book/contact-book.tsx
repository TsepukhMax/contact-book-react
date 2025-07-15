import React, { useEffect, useMemo, useState } from 'react'
import './contact-book.scss'
import ContactSearch from '../contact-search/contact-search'
import ContactItem from '../contact-item/contact-item'
import ContactDetail from '../contact-detail/contact-detail'
import { IContact } from '../../interfaces'

function ContactBook() {
  const [contacts, setContacts] = useState<IContact[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    fetch('http://localhost:3001/contacts')
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(err => console.error('Error loading contacts', err))
  }, [])

  const filteredContacts = useMemo(() => {
    const normalized = searchTerm.trim().toUpperCase()
    if (!normalized) return contacts
  
    return contacts.filter(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toUpperCase()
      return fullName.includes(normalized)
    })
  }, [searchTerm, contacts])  

  const shortContacts = useMemo(() => {
    return filteredContacts.map(({ id, firstName, lastName }) => ({
      id, firstName, lastName
    }))
  }, [filteredContacts])

  const selectedContact = useMemo(() => {
    return contacts.find(c => c.id === selectedId) || null
  }, [selectedId, contacts])

  const selectContact = (id: number) => {
    setSelectedId(id)
  }

  return (
    <div className='container'>
      <div className='left-panel'>
        <ContactSearch onSearchTermChange={setSearchTerm} />
        {shortContacts.map(contact => (
          <ContactItem
            key={contact.id}
            firstName={contact.firstName}
            lastName={contact.lastName}
            isSelected={selectedContact?.id === contact.id}
            onClick={() => selectContact(contact.id)}
          />
        ))}
      </div>

      <div className='right-panel'>
        <ContactDetail contact={selectedContact} />
      </div>
    </div>
  )
}

export default ContactBook
