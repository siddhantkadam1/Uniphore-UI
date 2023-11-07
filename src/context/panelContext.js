import { createContext, useContext, useReducer } from "react";
import PanelReducer from "./panelReducer";

export const initialState = {
    toggle:false,
    data : {}
}
 
export const PanelContext = createContext({});

//  export const PanelContextProvider = ({children})=>{
//     const [state,dispatch] = useReducer(PanelReducer,initialState);

//     return (<PanelContext.Provider value={{state,dispatch}}>{children}</PanelContext.Provider>); 
//  }