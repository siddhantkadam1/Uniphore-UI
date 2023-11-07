import React from 'react'
import '../global-spinner/globalSpinner.css'
import { useSpinner } from '../../context/spinnerContext'

const GlobalSpinner = () => {
    const {flag} = useSpinner();
  return (
    <div className={`${flag ?'spinner-container show':'spinner-container'} `}>
      <div className="spinner">
      </div>
    </div>
  )
}

export default GlobalSpinner
