import React, { useEffect, useMemo, useState } from 'react'
import './contact-book.scss'
import ContactSearch from '../contact-search/ContactSearch'
import ContactItem from '../contact-item/ContactItem'
import ContactDetail from '../contact-detail/ContactDetail'
import ContactForm from '../contact-form/ContactForm'
import { IContact, IContactShort } from '../../interfaces'
import { getFullName } from '../../utils'
import axios from 'axios'

const baseUrl = 'http://localhost:8080/contacts'

function ContactBook() {
  const [shortContacts, setShortContacts] = useState<IContactShort[]>([])
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null)
  const [editingContact, setEditingContact] = useState<IContact | null>(null)
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
        const fullName = getFullName(contact.firstName, contact.lastName).toUpperCase()
        return fullName.includes(normalized)
      })
    }
  
    return filtered.sort((a, b) => 
      getFullName(a.firstName, a.lastName).localeCompare(getFullName(b.firstName, b.lastName))
    )
  }, [searchTerm, shortContacts])

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term)
  }

  const handleEditContact = () => {
    if (selectedContact) {
      setEditingContact(selectedContact)
    }
  }

  const handleSaveContact = async (contact: IContact) => {
    try {
      await axios.put(`${baseUrl}/${contact.id}`, { contact })
      
      setSelectedContact(contact)
      
      setShortContacts(prev => 
        prev.map(c => 
          c.id === contact.id 
            ? { id: contact.id, firstName: contact.firstName, lastName: contact.lastName }
            : c
        )
      )
    
      setEditingContact(null)
    } catch (err) {
      console.error('Error saving contact', err)
    }
  }

  const handleCancelEdit = () => {
    setEditingContact(null)
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
        {selectedContact ? (
          editingContact ? (
            <ContactForm 
              contact={editingContact}
              onSave={handleSaveContact}
              onCancel={handleCancelEdit}
            />
          ) : (
            <ContactDetail 
              contact={selectedContact} 
              onEdit={handleEditContact}
            />
          )
        ) : (
          <div className="no-contact-selected">
            Select contact to see detailed information
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactBook