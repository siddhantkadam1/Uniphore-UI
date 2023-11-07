import { createContext, useContext, useState } from "react";


const DialogDataContext = createContext([]);

export const DialogDataProvider = ({ children }) => {
    const [dialogData, setDialogData] = useState([]);
    return <DialogDataContext.Provider value={{ dialogData, setDialogData }}>
        {children}
    </DialogDataContext.Provider>
}
export const useDialogData = (e) => {
    return useContext(DialogDataContext)
}
