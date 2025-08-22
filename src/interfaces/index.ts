export interface IContact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  notes: string;
}

export interface IContactShort {
  id: number;
  firstName: string;
  lastName: string;
}

export interface IContactItemProps {
  firstName: string
  lastName: string
  isSelected: boolean
  contactId: number
  onSelect: (contactId: number) => void
}

export interface IContactDetailProps {
  contact: IContact;
  onEdit: () => void;
  onDelete: (contactId: number) => void;
}

export type ContactFormData = Omit<IContact, 'id'> & {id?: number};

export interface IContactFormProps {
  contact: IContact | null
  onSave: (contact: ContactFormData) => void
  onCancel: () => void
}