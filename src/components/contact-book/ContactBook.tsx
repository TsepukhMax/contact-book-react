import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showForm, setShowForm] = useState<boolean>(false)
  const isFetchingRef = useRef(false);

  useEffect(() => {
    axios.get(baseUrl)
      .then(res => setShortContacts(res.data))
      .catch(err => console.error('Error loading contacts list', err))
  }, [])

  const handleSelectContact = useCallback((id: number) => {
    setShowForm(false);
    if (selectedContact?.id === id || isFetchingRef.current) return;

    isFetchingRef.current = true;
    axios.get(`${baseUrl}/${id}`)
      .then(res => setSelectedContact(res.data))
      .catch(err => console.error('Error loading contact by ID', err))
      .finally(() => {isFetchingRef.current = false;})

  }, [selectedContact])

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
    if (selectedContact) setShowForm(true);
  }, [selectedContact])

  const handleSaveContact = useCallback(async (contact: IContact) => {
    try {
      await axios.put(`${baseUrl}/${contact.id}`, { contact })
      
      setSelectedContact(contact as IContact)
      
      setShortContacts(prev => 
        prev.map(c => 
          c.id === contact.id 
            ? { id: contact.id, firstName: contact.firstName, lastName: contact.lastName }
            : c
        )
      )
    
      setShowForm(false);
    } catch (err) {
      console.error('Error saving contact', err)
    }
  }, [])

  const handleAddContact = () => {
    setShowForm(true)
    setSelectedContact(null)
  }

  const handleCreateContact = useCallback(async (contact: IContact) => {
    try {
      const response = await axios.post(`${baseUrl}`, { contact })
      const newContactId = response.data
      
      setShortContacts(prev => [
        ...prev,
        { id: newContactId, firstName: contact.firstName, lastName: contact.lastName }
      ])
      
      setShowForm(false)
      
    } catch (err) {
      console.error('Error creating contact', err)
      alert('Failed to create contact')
    }
  }, [])

  const handleDeleteContact = useCallback(async (contactId: number) => {
    try {
      await axios.delete(`${baseUrl}/${contactId}`)
      
      setShortContacts(prev => prev.filter(c => c.id !== contactId));
      setSelectedContact(null);
      
    } catch (err) {
      console.error('Error deleting contact', err)
      alert('Failed to delete contact')
    }
  }, [])

  return (
    <div className='container'>
      <div className='left-panel'>
        <ContactSearch onSearchTermChange={handleSearchTermChange} />

        <button className='add-contact' onClick={handleAddContact}>Add Contact</button>
        <div className='contact-list'>
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
      </div>

      <div className='right-panel'>
        {showForm ? (
          <ContactForm 
            contact={selectedContact}
            onSave={selectedContact ? handleSaveContact : handleCreateContact}
            onCancel={() => setShowForm(false)}
          />
        ) : selectedContact ? (
          <ContactDetail 
            contact={selectedContact} 
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        ) : (
          <div className="no-contact-selected">
            Select a contact to view details!
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactBook