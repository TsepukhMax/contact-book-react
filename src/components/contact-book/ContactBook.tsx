import React, { useEffect, useMemo, useState } from 'react'
import './contact-book.scss'
import ContactSearch from '../contact-search/ContactSearch'
import ContactItem from '../contact-item/ContactItem'
import ContactDetail from '../contact-detail/ContactDetail'
import { IContact, IContactShort } from '../../interfaces'
import axios from 'axios'

const baseUrl = 'http://localhost:8080/contacts'

function ContactBook() {
  const [shortContacts, setShortContacts] = useState<IContactShort[]>([])
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    axios.get(baseUrl)
      .then(res => setShortContacts(res.data))
      .catch(err => console.error('Error loading contacts list', err))
  }, [])

  const handleSelectContact = (id: number) => {
    axios.get(`${baseUrl}/${id}`)
      .then(res => setSelectedContact(res.data))
      .catch(err => console.error('Error loading contact by ID', err))
  }

  const filteredContacts = useMemo(() => {
    const normalized = searchTerm.trim().toUpperCase()
    let filtered = shortContacts

    if (normalized) {
      filtered = shortContacts.filter(contact => {
        const fullName = `${contact.firstName} ${contact.lastName}`.toUpperCase()
        return fullName.includes(normalized)
      })
    }
  
    return filtered.sort((a, b) => 
      `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    )
  }, [searchTerm, shortContacts])

    const handleSearchTermChange = (term: string) => {
      setSearchTerm(term)
    }

  return (
    <div className='container'>
      <div className='left-panel'>
        <ContactSearch onSearchTermChange={handleSearchTermChange} />
        {filteredContacts.map(contact => (
          <ContactItem
            key={contact.id}
            firstName={contact.firstName}
            lastName={contact.lastName}
            isSelected={selectedContact?.id === contact.id}
            onClick={() => handleSelectContact(contact.id)}
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