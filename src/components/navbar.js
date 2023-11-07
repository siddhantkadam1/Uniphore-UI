import '../../src/App.css';
import '../../src/styles/navbar.css'

import {
  useNavigate,
  NavLink
} from "react-router-dom";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from "../context/auth";
import useLocalStorage from './custome-hooks/UseLocalStorage';
import { useEffect, useState } from 'react';
import { AES, enc } from 'crypto-js';



function Navbar() { 
  const navigate = useNavigate();

  const handleRoute = (path) => {
    navigate(path)
  };

  const logout = (e) => {
    localStorage.removeItem('encryptedData')
    localStorage.removeItem('token')
    navigate('/login')
  } 
  
  return (
    <>
      <div className='nav-container'>
        <div className='nav-logo-container'>
          <h2 className='nav-logo' onClick={() => { handleRoute('/dashboard') }}>UDOps</h2>
        </div>
        <div className='nav-list-container'>
          <div className='nav-list-items'>
            <div className='nav-list-item'>
              <NavLink to='/dashboard' className={({ isActive }) => (isActive ? 'navLink active' : 'navLink inactive')}>Dashboard</NavLink>
            </div>
            <div className='nav-list-item'>
              <NavLink to='/corpus-management' className={({ isActive }) => (isActive ? 'navLink active' : 'navLink inactive')}>Corpus Management</NavLink>
            </div> 
            <div className='nav-list-item'>
              {
                localStorage.getItem('encryptedData')
                &&
                JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'), process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role === 'Admin user'
                &&
                <NavLink to='/user-management' className={({ isActive }) => (isActive ? 'navLink active' : 'navLink inactive')}>User Management</NavLink>}
            </div>
            <div className='nav-list-item'>
              <div className='user-profile'>
                <div className='profile-photo'>
                  <PersonIcon sx={{ fontSize: '25px' }}></PersonIcon>
                </div>
                <div className='profile-name'> 
                  <p>{
                    localStorage.getItem('encryptedData')
                    &&
                    JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'), process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.user_data[0]?.user_name
                     }
                  </p>
                </div>
                <div className='nav-list-item' onClick={logout}>
                  <button class="logout-button">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
