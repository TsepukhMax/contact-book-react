import React from 'react'
import { useForm } from 'react-hook-form'
import { IContact, IContactFormProps } from '../../interfaces'
import './contact-form.scss'

function ContactForm({ contact, onSave, onCancel }: IContactFormProps) {
  const defaultValues: Partial<IContact> = contact ?? {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    notes: ''
  };
  
  const {register,handleSubmit, formState: { errors }} = useForm<IContact>({
    defaultValues
  })

  const onSubmit = (data: IContact) => {
    onSave( contact ? {...data, id: contact.id} : data);
  }

  return (
    <div className="contact-form">
      <h2>{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            {...register('firstName', { 
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters'
              }
            })}
          />
          {errors.firstName && (
            <div className="error">{errors.firstName.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            {...register('lastName', { 
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters'
              }
            })}
          />
          {errors.lastName && (
            <div className="error">{errors.lastName.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            {...register('phoneNumber', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\+?\d+$/,
                message: 'Only numbers and + allowed'
              }
            })}
          />
          {errors.phoneNumber && (
            <div className="error">{errors.phoneNumber.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format "example@example.com" and use latin letters only'
              }
            })}
          />
          {errors.email && (
            <div className="error">{errors.email.message}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            {...register('notes')}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save">Save</button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default React.memo(ContactForm)