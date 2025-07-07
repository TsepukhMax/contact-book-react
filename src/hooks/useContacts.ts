import { useState, useMemo } from 'react'
import { IContact, IContactShort } from '../interfaces/index'

export function useContacts() {
  const [shortContacts] = useState<IContactShort[]>([
    { id: 1, firstName: 'Artem', lastName: 'Smith' },
    { id: 2, firstName: 'Adam', lastName: 'Johnson' },
    { id: 3, firstName: 'Adrian', lastName: 'Williams' },
    { id: 4, firstName: 'Andrew', lastName: 'Jones' },
    { id: 5, firstName: 'Arnold', lastName: 'Brown' },
  ])  
  
  const [fullContacts] = useState<IContact[]>([
    {
      id: 1,
      firstName: 'Artem',
      lastName: 'Smith',
      phoneNumber: '380677384250',
      email: 'user1@example.com',
      notes: 'Note for Artem Smith',
    },
    {
      id: 2,
      firstName: 'Adam',
      lastName: 'Johnson',
      phoneNumber: '380677384251',
      email: 'user2@example.com',
      notes: 'Note for Adam Johnson',
    },
    {
      id: 3,
      firstName: 'Adrian',
      lastName: 'Williams',
      phoneNumber: '380677384252',
      email: 'user3@example.com',
      notes: 'Note for Adrian Williams',
    },
    {
      id: 4,
      firstName: 'Andrew',
      lastName: 'Jones',
      phoneNumber: '380677384253',
      email: 'user4@example.com',
      notes: 'Note for Andrew Jones',
    },
    {
      id: 5,
      firstName: 'Arnold',
      lastName: 'Brown',
      phoneNumber: '380677384254',
      email: 'user5@example.com',
      notes: 'Note for Arnold Brown',
    },
  ])

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedContact = useMemo(() => {
    return fullContacts.find((contact) => contact.id === selectedId) || null
  }, [selectedId, fullContacts])

  const selectContact = (id: number) => {
    setSelectedId(id)
  }

  return {
    shortContacts,
    selectedContact,
    selectContact   
  }
}