import React from 'react'
import './contact-detail.component.scss'
import { IContactDetailProps } from '../../interfaces/index'

function ContactDetailComponent({ contact }: IContactDetailProps) {
  if (!contact) return null

  return (
    <div className="contact-detail">
      <h2>Contact Details</h2>
      <div className="detail-row"><span>ID:</span> {contact.id}</div>
      <div className="detail-row"><span>Full Name:</span> {contact.firstName} {contact.lastName}</div>
      <div className="detail-row"><span>Phone Number:</span> {contact.phoneNumber}</div>
      <div className="detail-row"><span>Email:</span> {contact.email}</div>
      <div className="detail-row"><span>Notes:</span> {contact.notes}</div>
    </div>
  )
}

export default ContactDetailComponent