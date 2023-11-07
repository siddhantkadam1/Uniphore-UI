import React from 'react'
import "../../src/styles/menu.css";

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function Menu(props) {
    let { index, idx } = props;

    if (props.pushPull) {
        return (
            <div className={`${index == idx ? 'menu show show-push-pull' : 'menu'}`} >
                <div className='menu-flex margin-btm edit-row' onClick={() => props.callPush(props.row)}>
                    <span className='edit-icon push'>Push Changes</span>
                </div>
                <div className='menu-flex delete-row' onClick={() => props.callPull(props.row)}>
                    <span className='delete-icon pull'>Pull Changes</span>
                </div>
            </div>
        )
    } else if (props.teamsTable) {
        return (
            <div className={`${index == idx ? 'menu show' : 'menu'}`} >
                <div className='menu-flex margin-btm edit-row' onClick={() => props.openPanel(props.row, true)}>
                    <ModeEditOutlineOutlinedIcon className='edit-mui-icon' />
                    <span className='edit-icon'>Edit</span>
                </div>
                <div className='menu-flex delete-row' onClick={()=>props.deleteTeam(props.row)}>
                    <DeleteOutlineOutlinedIcon className='delete-mui-icon' />
                    <span className='delete-icon'>Delete</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className={`${index == idx ? 'menu show' : 'menu'}`} >
                <div className='menu-flex margin-btm edit-row' onClick={() => props.openPanel(props.row, true)}>
                    <ModeEditOutlineOutlinedIcon className='edit-mui-icon' />
                    <span className='edit-icon'>Edit</span>
                </div>
            </div>
        )
    }
}

export default Menu;
