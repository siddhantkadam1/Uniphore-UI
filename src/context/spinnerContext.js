import { createContext, useContext, useState } from "react";


export const GlobalSpinnerContext = createContext(false);

export const SpinnerProvider = ({ children }) => {
    const [flag, setFlag] = useState(false)
    return <GlobalSpinnerContext.Provider value={{flag,setFlag}}>
        {children}
    </GlobalSpinnerContext.Provider>
}

export const useSpinner = (e)=>{
    return useContext(GlobalSpinnerContext);
}