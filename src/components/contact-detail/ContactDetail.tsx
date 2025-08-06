import React from 'react'
import './contact-detail.scss'
import { IContactDetailProps } from '../../interfaces/index'
import { getFullName } from '../../utils'

function ContactDetail({ contact, onEdit, onDelete }: IContactDetailProps) {
  return (
    <div className="contact-detail">
      <div className="contact-detail-header">
        <h2>Contact Details</h2>
        <div className="contact-actions">
          <button onClick={onEdit}>
            Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(contact.id)}>
            Delete
          </button>
        </div>
      </div>
      <div className="detail-row"><span>Full Name:</span> {getFullName(contact.firstName, contact.lastName)}</div>
      <div className="detail-row"><span>Phone Number:</span> {contact.phoneNumber}</div>
      <div className="detail-row"><span>Email:</span> {contact.email}</div>
      <div className="detail-row"><span>Notes:</span> {contact.notes}</div>
    </div>
  )
}

export default React.memo(ContactDetail)