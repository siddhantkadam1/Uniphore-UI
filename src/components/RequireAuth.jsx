import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth'
import { AES, enc } from 'crypto-js';


export default function RequireAuth({ children }) {
    const { user } = useAuth();
    const [loggedInUser, setLoggedInUser] = React.useState()

    const encryptedData = localStorage.getItem('encryptedData');
    const decryptedData = AES.decrypt(encryptedData, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8)
    const parsedData = JSON.parse(decryptedData);
    const userRole = parsedData?.User_role;
 

    React.useEffect(() => {
        if (user?.User_role) {
          const userInfoFromLocalStorage = localStorage.getItem('userInfo');
          if (userInfoFromLocalStorage) {
            setLoggedInUser(JSON.parse(userInfoFromLocalStorage));
          }
        }
      }, [user?.User_role]);
      


    //    uncommnet later start
    // if (localStorage.getItem('encryptedData') && JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'),  process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8)) && JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'),  process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role) {
    //     if (JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'),  process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role && JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'),  process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role === 'Admin user')
    //         return <div>{children}</div>
    //     else if (JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'),  process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role && JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'),  process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role !== 'Admin user')
    //         return <div style={{ marginTop: '2rem', marginLeft: '2rem' }}>Permission Denied</div>
    //     else
    //         return <Navigate to='/login'></Navigate>
    // } else {
    //     return <Navigate to='/login'></Navigate>
    // }
    //    uncommnet later end


    if (userRole) {
        if (userRole === 'Admin user') {
            return <div>{children}</div>;
        } else {
            return <div style={{ marginTop: '2rem', marginLeft: '2rem' }}>Permission Denied</div>;
        }
    } else {
        return <Navigate to='/login'></Navigate>;
    } 


}
