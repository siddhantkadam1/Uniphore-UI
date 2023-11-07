import '../../src/App.css';
import '../styles/user-management.css'
import Navbar from './navbar';
import CommonTable from './user-management-table/CommonTable';
import UsersTable from './user-management-table/UsersTable';
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { SearchContext } from '../context/searchContext'
import { useContext, useRef, useState } from "react";
import { PanelContext } from '../context/panelContext'


function UserManagement() {

  const { setSearchUsers, setSearchTeams } = useContext(SearchContext)
  const { toggle, setToggle } = useContext(PanelContext)
  const [clear, setClear] = useState(false);
  const [inputVal, setInpuVal] = useState('');
  const [activeTabIdx, setActiveTabIdx] = useState(1);
  const [text, setText] = useState('+ ADD TEAM');

  const handleChange = (e) => {
    if (activeTabIdx == 1) {
      setSearchTeams(e.target.value)
      if (!e.target.value) {
        setSearchTeams('');
      }
      setInpuVal(e.target.value);
      if (e.target.value) {
        setClear(true);
      } else {
        setClear(false);
      }
    } else {
      setSearchUsers(e.target.value)
      if (!e.target.value) {
        setSearchUsers('');
      }
      setInpuVal(e.target.value);
      if (e.target.value) {
        setClear(true);
      } else {
        setClear(false);
      }
    }
  }

  const handleClick = (e) => {
     if(activeTabIdx==1){
      setSearchTeams('');
     }else{
      setSearchUsers('');
     }
    setClear(false);
    setInpuVal('');
  }

  const addActiveClass = (e, idx) => {
    const tabs = document.querySelectorAll('.tabs');
    if (idx == 0) {
      tabs[idx].classList.add('border-active');
      tabs[1].classList.remove('border-active');
      setText('+ ADD TEAM')
    } else {
      tabs[idx].classList.add('border-active');
      tabs[0].classList.remove('border-active');
      setText('+ ADD NEW USER')
    }
  }

  const openDrawer = (text) => {
    if (text == '+ ADD NEW USER') {
      setToggle({ ...toggle, isUserDrawerOpen: true })
    } else {
      setToggle({ ...toggle, isDrawerOpen: true })
    }
  }


  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#02387A",
    "&:hover": {
      backgroundColor: "#02387A",
    },
  }));

  return (
    <div className="user-management-container">
      <Navbar />
      <div className='user-management-bottom-container'>
        <div className='user-management-flex'>
          <div className='users-left'>
            <div className='teams tabs border-active' onClick={(e) => { setActiveTabIdx(1); addActiveClass(e, 0) }}>Teams</div>
            <div className='users tabs' onClick={(e) => { setActiveTabIdx(2); addActiveClass(e, 1) }}>Users</div>
          </div>
          <div className='users-right'>
            <div className="corpus-info-input-search">
              <div className="search-container">
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleChange}
                  value={inputVal}
                />

                {/* <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
               {clear ? <ClearOutlinedIcon onClick={handleClick} />: <SearchIcon />}
              </IconButton> */}
                {clear ?
                  <IconButton onClick={handleClick} type="button" sx={{ p: "10px" }} aria-label="search">
                    <ClearOutlinedIcon />
                  </IconButton>
                  :
                  <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                }
              </div>
            </div>
            <div className="corpus-info-input-button advance-search-btn" onClick={(e) => { openDrawer(text) }}>
              <ColorButton variant="contained">{text}</ColorButton>
            </div>
          </div>
        </div>
        {activeTabIdx == 1 && <CommonTable />}
        {activeTabIdx == 2 && <UsersTable />}
      </div>
    </div>
  );
}

export default UserManagement;