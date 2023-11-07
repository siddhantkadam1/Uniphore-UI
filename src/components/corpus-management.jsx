import '../../src/App.css';
import '../styles/corpus-management.css'
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
import CustomPaginationActionsTable from './custom-table';
import Filter from './advance-filter/Filter';
import MyCorpusTable from '../common-components/my-corpus/MyCorpusTable';


function CorpusManagement() {

    const { setSearchMycorpus, setSearchTeams, setSearchValue } = useContext(SearchContext)
    const { toggle, setToggle } = useContext(PanelContext)
    const { corpusState,setCorpusState } = useContext(PanelContext)
    const [clear, setClear] = useState(false);
    const [clear2, setClear2] = useState(false);
    const [inputVal, setInpuVal] = useState('');
    const [inputVal2, setInpuVal2] = useState('');
    const [activeTabIdx, setActiveTabIdx] = useState(1);

    const handleChange = (e) => {
        if (activeTabIdx == 1) {
            setSearchValue(e.target.value)
            if (!e.target.value) {
                setSearchValue('');
            }
            setInpuVal(e.target.value);
            if (e.target.value) {
                setClear(true);
            } else {
                setClear(false);
            }
        } else {
            setSearchMycorpus(e.target.value)
            if (!e.target.value) {
                setSearchMycorpus('');
            }
            setInpuVal2(e.target.value);
            if (e.target.value) {
                setClear2(true);
            } else {
                setClear2(false);
            }
        }
    }

    const handleClick = (e) => {
        if (activeTabIdx == 1) {
            setSearchValue('');
            setSearchTeams('');
            setInpuVal('');
            setClear(false);
        } else {
            setSearchMycorpus('');
            setInpuVal2('');
            setClear2(false);
        }
    }

    const openDrawer = (text) => {
        setToggle({ ...toggle, isCreateCorpusDrawerOpen: true })
        setCorpusState({...corpusState,callTeamListApi:true})
    }
    const open = (text) => {
        setToggle({ ...toggle, isCloneDrawerOpen: true })
        setCorpusState({...corpusState,callTeamListApi:true})
    }

    const addActiveClass = (e, idx) => {
        const tabs = document.querySelectorAll('.tabs');
        if (idx == 0) {
            tabs[idx].classList.add('border-active');
            tabs[1].classList.remove('border-active');
        } else {
            tabs[idx].classList.add('border-active');
            tabs[0].classList.remove('border-active');
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
                <div className='corpus-management-flex'>
                    <div className='users-left'>
                        <div className='teams tabs border-active' onClick={(e) => { setActiveTabIdx(1); addActiveClass(e, 0) }}>Corpus Search</div>
                        <div className='users tabs' onClick={(e) => { setActiveTabIdx(2); addActiveClass(e, 1) }}>My Corpus</div>
                    </div>
                </div>
                {
                    activeTabIdx == 1 &&
                    <div className='corpus-mg-right'>
                        <div className="corpus-mg-info-input-button corpus-info-input-button advance-search-btn"  >
                            <ColorButton variant="contained">ADVANCE SEARCH</ColorButton>
                            <Filter></Filter>

                        </div>
                        <div className="corpus-info-input-search">
                            <div className="search-container">
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search"
                                    inputProps={{ "aria-label": "search" }}
                                    onChange={handleChange}
                                    value={inputVal}
                                />
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
                    </div>
                }
                {
                    activeTabIdx == 2 &&
                    <div className='corpus-mg-right  dir-reverse'>
                        <div className="corpus-info-input-search">
                            <div className="search-container">
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search"
                                    inputProps={{ "aria-label": "search" }}
                                    onChange={handleChange}
                                    value={inputVal2}
                                />
                                {clear2 ?
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
                        <div className="corpus-mg-info-input-button advance-search-btn" onClick={openDrawer}  >
                            <ColorButton variant="contained">CREATE CORPUS</ColorButton>
                        </div>
                        <div className="corpus-mg-info-input-button advance-search-btn" onClick={open}  >
                            <ColorButton variant="contained">CLONE CORPUS</ColorButton>
                        </div>
                    </div>
                }
                {activeTabIdx == 1 && <CustomPaginationActionsTable />}
                {activeTabIdx == 2 && <MyCorpusTable />}
            </div>
        </div>
    );
}

export default CorpusManagement;