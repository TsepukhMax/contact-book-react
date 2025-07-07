import React from 'react'
import { useRef } from 'react'
import searchIcon from '../../assets/img/search.jpg'
import './contact-search.component.scss'  

function ContactSearchComponent() {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const onInput = () => {
    const value = searchInputRef.current?.value
  }

  const onReset = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }
  }

  return (
    <div className='search-container'>
      <img src={searchIcon} alt='Search Icon' className='search-icon' />
      <input
        ref={searchInputRef}
        type='text'
        className='search-input'
        placeholder='Search'
        onInput={onInput}
      />
      <button onClick={onReset}>Reset</button>
    </div>
  )
}

export default ContactSearchComponent