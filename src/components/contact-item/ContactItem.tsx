import React from 'react'
import './contact-item.scss'
import { IContactItemProps } from '../../interfaces/index'
import { getFullName } from '../../utils'

function ContactItem({ firstName, lastName, isSelected, contactId, onSelect }: IContactItemProps) {
  return (
    <div 
      className={`contact-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(contactId)}
    >
    <span className="contact-name">{getFullName(firstName, lastName)}</span>
  </div>
  )
} 

export default React.memo(ContactItem)