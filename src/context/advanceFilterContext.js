import { createContext, useContext, useState } from "react";


export const AdvanceFilterContext = createContext({});

export const FilterProvider = ({ children }) => {
    const [data, setData] = useState({language:[],source_type:[],corpus_type:[]})
    return <AdvanceFilterContext.Provider value={{data,setData}}>
        {children}
    </AdvanceFilterContext.Provider>
}

export const useFilterData = (e)=>{
    return useContext(AdvanceFilterContext);
}