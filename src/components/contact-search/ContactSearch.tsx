import React from 'react'
import { useRef } from 'react'
import searchIcon from '../../assets/img/search.svg'
import './contact-search.scss'  

function ContactSearch({ onSearchTermChange }: { onSearchTermChange: (term: string) => void }) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const onInput = () => {
    const value = searchInputRef.current?.value || ''
    onSearchTermChange(value)
  }

  const onReset = () => {
    if (searchInputRef.current) { 
      searchInputRef.current.value = ''
      onSearchTermChange('')
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

export default React.memo(ContactSearch)