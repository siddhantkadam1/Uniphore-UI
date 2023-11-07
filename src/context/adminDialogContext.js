import { createContext, useContext, useState } from "react";


export const DialogContext = createContext(false);

export const DialogProvider = ({ children }) => {
    const [dialogFlag, setDialogFlag] = useState(false)
    return <DialogContext.Provider value={{dialogFlag,setDialogFlag}}>
        {children}
    </DialogContext.Provider>
}

export const useAdminDialog = (e)=>{
    return useContext(DialogContext);
}