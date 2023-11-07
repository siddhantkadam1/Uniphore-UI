import { createContext, useContext, useState } from "react";


export const GlobalSnackbarContext = createContext(false);

export const SnackbarProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [success, setSuccess] = useState('');
    return <GlobalSnackbarContext.Provider value={{open,setOpen,setMsg,msg,success,setSuccess}}>
        {children}
    </GlobalSnackbarContext.Provider>
}

export const useSnackbar = (e)=>{
    return useContext(GlobalSnackbarContext);
}