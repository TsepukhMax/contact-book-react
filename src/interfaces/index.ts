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
  onClick: () => void 
}

export interface IContactDetailProps {
  contact: IContact;
  onEdit: () => void
}
export interface IContactFormProps {
  contact: IContact
  onSave: (contact: IContact) => void
  onCancel: () => void
}