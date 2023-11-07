import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PageNotFound() {
  const navigate = useNavigate();

    const handleNavigate = (e)=>{
      navigate('/dashboard')
    }
  return (
    <div style={{margin:'4rem'}}>
         <div>Page not found</div>
         <div style={{color:'blue',borderBottom:'1px solid blue',width:'fit-content',marginTop:'8px',cursor:'pointer'}} onClick={handleNavigate}>Go to Home page</div>
    </div>
  )
}
