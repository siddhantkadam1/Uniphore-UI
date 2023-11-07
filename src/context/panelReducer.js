

const PanelReducer = (state,action)=>{
    switch(action.type){
        case "toggle":
            return {...state}
            default :
            return state;    
    }
}

export default PanelReducer;