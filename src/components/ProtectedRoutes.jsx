import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth'
import { AES, enc } from 'crypto-js';


export default function ProtectedRoutes({children}) {

    if(localStorage.getItem('encryptedData')){
        if (JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'),  process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role)
        return <div>{children}</div>
    else
        return <Navigate to='/login'></Navigate>
    }else{
        return <Navigate to='/login'></Navigate>
    } 
}
