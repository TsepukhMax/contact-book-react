import React from 'react'
import './contact-item.component.scss'
import { IContactItemProps } from '../../interfaces/index'

function ContactItemComponent({ firstName, lastName, isSelected }: IContactItemProps) {
  return (
    <div className={`contact-item ${isSelected ? 'selected' : ''}`}>
    <span className="contact-name">{firstName} {lastName}</span>
  </div>
  )
} 

export default ContactItemComponent