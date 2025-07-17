import React from 'react'
import './contact-item.scss'
import { IContactItemProps } from '../../interfaces/index'

function ContactItem({ firstName, lastName, isSelected, onClick }: IContactItemProps) {
  return (
    <div 
      className={`contact-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
    <span className="contact-name">{firstName} {lastName}</span>
  </div>
  )
} 

export default ContactItem