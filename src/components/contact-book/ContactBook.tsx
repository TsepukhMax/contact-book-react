import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  const [isAddingContact, setIsAddingContact] = useState<boolean>(false)

  useEffect(() => {
    axios.get(baseUrl)
      .then(res => setShortContacts(res.data))
      .catch(err => console.error('Error loading contacts list', err))
  }, [])

  const handleSelectContact = useCallback((id: number) => {
    axios.get(`${baseUrl}/${id}`)
      .then(res => setSelectedContact(res.data))
      .catch(err => console.error('Error loading contact by ID', err))
  }, [])

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

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleEditContact = useCallback(() => {
    if (selectedContact) {
      setEditingContact(selectedContact)
    }
  }, [selectedContact])

  const handleSaveContact = useCallback(async (contact: IContact) => {
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
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingContact(null)
  }, [])

  const handleAddContact = useCallback(() => {
    setIsAddingContact(true)
    setSelectedContact(null)
    setEditingContact(null)
  }, [])

  const handleCreateContact = useCallback(async (contact: IContact) => {
    try {
      const response = await axios.post(`${baseUrl}`, { contact })
      const newContactId = response.data
      
      setShortContacts(prev => [
        ...prev,
        { id: newContactId, firstName: contact.firstName, lastName: contact.lastName }
      ])
      
      setIsAddingContact(false)
      
    } catch (err) {
      console.error('Error creating contact', err)
      alert('Failed to create contact')
    }
  }, [])
  
  const handleCancelCreate = useCallback(() => {
    setIsAddingContact(false)
  }, [])

  const handleDeleteContact = useCallback(async (contactId: number) => {
    try {
      await axios.delete(`${baseUrl}/${contactId}`)
      
      setShortContacts(prev => prev.filter(c => c.id !== contactId))
      setSelectedContact(null)
      
    } catch (err) {
      console.error('Error deleting contact', err)
      alert('Failed to delete contact')
    }
  }, [])

  return (
    <div className='container'>
      <div className='left-panel'>
        <ContactSearch onSearchTermChange={handleSearchTermChange} />

        <button onClick={handleAddContact}>Add Contact</button>

        {filteredContacts.map(contact => (
          <ContactItem
            key={contact.id}
            firstName={contact.firstName}
            lastName={contact.lastName}
            isSelected={selectedContact?.id === contact.id}
            contactId={contact.id}
            onSelect={handleSelectContact}
          />
        ))}
      </div>

      <div className='right-panel'>
        {isAddingContact ? (
          <ContactForm 
            mode="create"
            onSave={handleCreateContact}
            onCancel={handleCancelCreate}
          />
        ) : editingContact ? (
          <ContactForm 
            mode="edit"
            contact={editingContact}
            onSave={handleSaveContact}
            onCancel={handleCancelEdit}
          />
        ) : selectedContact ? (
          <ContactDetail 
            contact={selectedContact} 
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        ) : (
          <div className="no-contact-selected">
            There are no contacts to display!
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactBook