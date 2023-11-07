import React from 'react'
import '../user-details-sidebar/user-details-sidebar.css'
import { colors, Drawer } from '@mui/material'
import { useContext, useState, useEffect } from 'react'
import { PanelContext } from '../../context/panelContext'
import crossIcon from "../../../src/assets/cancel_FILL0_wght400_GRAD0_opsz48.png";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, InputLabel, Select, Checkbox, ListItemText } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from 'axios'
import { env } from '../../environments'





const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function UserDetailsSidebar() {
    const { toggle, setToggle } = useContext(PanelContext)
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedValuesRead, setSelectedValuesRead] = useState([]);
    const [flip, setFlip] = useState(false);
    const [readUserSelected, setReadUserSelected] = useState(true);
    const [writeUserSelected, setWriteUserSelected] = useState(true);
    const [call, setCall] = useState(0);
    const [user, setUser] = useState('');
    const [writeUser, setWriteUser] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successWrite, setSuccessWrite] = useState('');
    const [successWriteSecondMsg, setSuccessWriteSecondMsg] = useState('');
    const [successReadSecondMsg, setSuccessReadSecondMsg] = useState('');
    const [errorMsgRead, setErrorMsgRead] = useState('');
    const [successRead, setSuccessRead] = useState('');
    const [userArr, setUserArr] = useState([]);
    const [userArr2, setUserArr2] = useState([]);
    const [callRead, setCallRead] = useState(0);
    const [callWrite, setCallWrite] = useState(0);
    const [users, setUsers] = useState({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@gmail.com',
        username: 'john1234',

    })
    const [userListWrite, setUserListWrite] = useState([])
    const [userListRead, setUserListRead] = useState([])


    const handleChangeuser = (e) => {
        let { name, value } = e.target;
        if (name == 'read') {
            setUser(value);
        } else if (name == 'write') {
            setWriteUser(value);
        }
    }

    // const handleChange = (e) => {
    //     let { name, value } = e.target;
    //     setUsers({ ...users, [name]: value });
    // }

    const onSubmit = (e) => {
        console.log('temas obj', users);
    }

    const deleteUser = (corpus, permission) => {
        let payload = {};
        payload['user_name'] = toggle.userDetailsObj.user_name;
        payload['teamname'] = corpus;
        payload['permission'] = permission;
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/remove_team_access_permission/`, payload)
            .then(res => {
                // setCallExistingUserApi(prev => prev + 1);
                if (permission === 'write') {
                    setCallWrite(prev => prev + 1);
                    setSuccessWrite('');
                    setSuccessWriteSecondMsg('');
                } else if (permission === 'read') {
                    setCallRead(prev => prev + 1);
                    setSuccessRead('');
                    setSuccessReadSecondMsg('');
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const handleCorpus = (e) => {
        // const { name, checked } = e.target;
        // let tempCorpusArr = [];
        // if (name == 'allSelect') {
        //     console.log(name);
        //     tempCorpusArr = userList.map(corpus => { return { ...corpus, isChecked: checked } })
        // } else {
        //     console.log(name);
        //     tempCorpusArr = userList.map(corpus =>
        //         corpus.corpus_name == name ? { ...corpus, isChecked: checked } : corpus
        //     )
        // }
        // setuser(tempCorpusArr);
    }
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedValues(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeRead = (event) => {
        const {
            target: { value },
        } = event;

        setSelectedValuesRead(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const clearForm = () => {
        setSelectedValues([]);
        setSelectedValuesRead([])
    }

    const addTeamNamesWrite = (e) => {
        resetMsg('write');
        resetMsg('read');
        if (selectedValues.length == 0) {
            setWriteUserSelected(false);
            return;
        } else {
            setWriteUserSelected(true);
        }
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/team_permission_write/ `,
            { user_name: toggle.userDetailsObj.user_name, teamname: selectedValues })
            .then(res => {

                if (res?.data?.status.includes('failed')) {
                    setErrorMsg('Something went wrong. ')
                    setTimeout(() => {
                        setErrorMsg('')
                    }, 1600);
                    return;
                }

                if (res?.data?.status.includes('The user does not have access to the team ')
                    || res?.data?.status.includes('failed')
                ) {
                    setErrorMsg('The user does not have access to the team ')
                    setTimeout(() => {
                        setErrorMsg('')
                    }, 1600);
                } else {
                    let arr = res.data?.data;
                    if (arr) {
                        if (arr.length > 1) {
                            let arr1 = arr[0];
                            let arr2 = arr[1];
                            // check if both arrays are not null and have some content in them
                            if (arr1 && arr1.length && arr2 && arr2.length) {
                                let teamsWithAccess = 'Team(s): ' + arr1.join() + ' already have access.'
                                let teamsWithoutUser = 'User is not present in team(s): ' + arr2.join();
                                setSuccessWrite(teamsWithAccess)
                                setSuccessWriteSecondMsg(teamsWithoutUser)
                                // check if the first array is not null and has some content while the second array is empty
                            } else if (arr1 && arr1.length && arr2 && arr2.length == 0) {
                                let teamsWithAccess = 'Team(s): ' + arr1.join() + ' already have access.'
                                setSuccessWrite(teamsWithAccess)
                                // check if the second array is not null and has some content while the first array is empty
                            } else if (arr1 && arr1.length == 0 && arr2 && arr2.length > 0) {
                                let teamsWithoutUser = 'User is not present in team(s):' + arr2.join()
                                setSuccessWrite(teamsWithoutUser)
                                // check if the first and second arrays are  empty - this indicates success
                            } else if (arr1 && arr1.length == 0 && arr2 && arr2.length == 0) {
                                setSuccessWrite('Team(s) added successfully');
                            }
                        }
                    } else {
                        setSuccessWrite('Something went wrong');
                    }
                    setCallWrite(prev => prev + 1)
                    // render read list also 
                    setCallRead(prev => prev + 1)
                    setErrorMsg('');
                    setTimeout(() => {
                        resetMsg('write');
                    }, 16000);
                }
            }).catch(err => {
                console.log(err);
                setErrorMsg('Something went wrong')
                setTimeout(() => {
                    setErrorMsg('')
                }, 1600);
            })
    }

    const resetMsg = (e)=>{
        if(e=='write'){
            setSuccessWrite('');
            setSuccessWriteSecondMsg('');
        }else if(e=='read'){
            setSuccessRead('')
            setSuccessReadSecondMsg('');
        }
    }


    const addTeamNamesRead = (e) => {
        if (selectedValuesRead.length == 0) {
            setReadUserSelected(false);
            return;
        } else {
            setReadUserSelected(true);
        }
        resetMsg('read');
        resetMsg('write');
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/team_permission_read/ `,
            { user_name: toggle.userDetailsObj.user_name, teamname: selectedValuesRead })
            .then(res => {
                if (res?.data?.status.includes('failed')) {
                    setErrorMsgRead('Something went wrong. ')
                    setTimeout(() => {
                        setErrorMsgRead('')
                    }, 1600);
                    return;
                }

                if (res?.data?.status.includes('The user does not have access to the team ')
                    || res?.data?.status.includes('failed')
                ) {
                    setErrorMsgRead('The user does not have access to the team ')
                    setTimeout(() => {
                        setErrorMsgRead('')
                    }, 1600);
                } else {
                    let arr = res.data?.data;
                    console.table(arr);
                    if (arr) {
                        if (arr.length > 1) {
                            let arr1 = arr[0];
                            let arr2 = arr[1];
                            // check if both arrays are not null and have some content in them
                            if (arr1 && arr1.length && arr2 && arr2.length) {
                                let teamsWithAccess = 'Team(s): ' + arr1.join() + ' already have access.'
                                let teamsWithoutUser = 'User is not present in team(s): ' + arr2.join();
                                console.log('teamsWithoutUser', teamsWithoutUser);
                                setSuccessRead(teamsWithAccess)
                                setSuccessReadSecondMsg(teamsWithoutUser)
                                // check if the first array is not null and has some content while the second array is empty
                            } else if (arr1 && arr1.length && arr2 && arr2.length == 0) {
                                let teamsWithAccess = 'Team(s): ' + arr1.join() + ' already have access.'
                                setSuccessRead(teamsWithAccess)
                                // check if the second array is not null and has some content while the first array is empty
                            } else if (arr1 && arr1.length == 0 && arr2 && arr2.length > 0) {
                                let teamsWithoutUser = 'User is not present in team(s):' + arr2.join()
                                setSuccessRead(teamsWithoutUser)
                                // check if the first and second arrays are  empty - this indicates success
                            } else if (arr1 && arr1.length == 0 && arr2 && arr2.length == 0) {
                                setSuccessRead('Team(s) added successfully');
                            }
                        }
                    } else {
                        setSuccessRead('Something went wrong');
                    }
                    setCallRead(prev => prev + 1)
                    // render write list also 
                    setCallWrite(prev => prev + 1)
                    setErrorMsgRead('');
                    setTimeout(() => {
                        resetMsg('read');
                    }, 160000);
                }

            }).catch(err => {
                console.log(err);
                setErrorMsgRead('Something went wrong. ')
                setTimeout(() => {
                    setErrorMsgRead('')
                }, 1600);
            })
    }


    useEffect(() => {

        if (toggle.isEdit == true) {
            setFlip(true);
        } else {
            setFlip(false);
        }

    }, [toggle.obj, toggle.isEdit]);


    useEffect(() => {
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/list_teams_write/ `,
            { user_name: toggle.userDetailsObj.user_name })
            .then(res => {
                if (!res.data.data || res.data.data.includes('Invalid user_name')) {
                    setUserListWrite([]);
                } else {
                    setUserListWrite(res.data.data);
                }
            }).catch(err => {
                console.log(err);
                setUserListWrite([]);
            })

    }, [toggle.userDetailsObj.user_name, callWrite])

    useEffect(() => {
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/list_teams_read/ `,
            { user_name: toggle.userDetailsObj.user_name })
            .then(res => {
                if (!res.data.data || res.data.data.includes('Invalid user_name')) {
                    setUserListRead([]);
                } else {
                    setUserListRead(res.data.data);
                }
            }).catch(err => {
                console.log(err);
                setUserListRead([]);
            })

    }, [toggle.userDetailsObj.user_name, callRead])

    useEffect(() => {
        if (toggle.isUserDetailsDrawerOpen) {
            setReadUserSelected(true);
            setWriteUserSelected(true);
            axios.get(`${env.BASE_URL}:${env.PORT}/udops/team/list/`)
                .then(response => {
                    if (response.data.length == 0 || response.data.data.length === 0) {
                    } else {
                        setUserArr(response.data.data.filter(obj => obj.teamname !== " "))
                        setUserArr2(response.data.data.filter(obj => obj.teamname !== " "))
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [toggle.userDetailsObj.user_name, toggle.isUserDetailsDrawerOpen]);

    return (
        <Drawer anchor='right' open={toggle.isUserDetailsDrawerOpen} >
            <div className="users-sidebar-wrapper">
                <div className="users-sidebar-header">
                    <p className="users-panel-title">User Details </p>
                    <div className="cross" onClick={(e) => {
                        setToggle({ ...toggle, isUserDetailsDrawerOpen: !toggle.isUserDetailsDrawerOpen });
                        clearForm();
                        setSuccessWrite('');
                        setSuccessWriteSecondMsg('');
                        setSuccessRead('');
                        setSuccessReadSecondMsg('');
                    }
                    }
                    >
                        <img src={crossIcon} alt='cancel' />
                    </div>
                </div>
                <div className="users-details-wrapper">
                    <div className="users-flex-col">
                        <div style={{ width: '49%' }}>
                            <span className="users-details-panel-lables">Github UserName</span>
                            <p className="users-details-lable-info label-modifier ">{toggle.userDetailsObj.user_name ?? "--"}</p>
                        </div>

                        <div className='users-details-two-col'>
                            <div>
                                <span className="users-details-panel-lables">First Name</span>
                                <p className="users-details-lable-info ">{toggle.userDetailsObj.firstname ?? "--"}</p>
                            </div>
                            <div>
                                <span className="users-details-panel-lables">Last Name </span>
                                <p className="users-details-lable-info ">{toggle.userDetailsObj.lastname ?? "--"}</p>
                            </div>
                        </div>

                        <div>
                            <span className="users-details-panel-lables">Email </span>
                            <p className="users-details-lable-info users-details-email ">{toggle.userDetailsObj.email ?? "--"}</p>
                        </div>
                    </div>

                    <div className='line'></div>
                    <h4 className='users-sidebar-middle-heading'> Teams with write access</h4>
                    <div className="users-sidebar-select-user custom-width-29vw">
                        <FormControl size="small" fullWidth sx={{ m: 0, maxWidth: '29vw' }}>
                            <InputLabel id="demo-multiple-checkbox-label">Add corpus</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedValues}
                                input={<OutlinedInput label="Add corpus" />}
                                onChange={handleChange}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                fullWidth
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            >
                                {userArr.map((obj, index) => (
                                    <MenuItem
                                        key={index}
                                        value={obj.teamname}
                                    >
                                        {obj.teamname !== " " && <Checkbox checked={selectedValues.indexOf(obj.teamname) > -1} />}
                                        {obj.teamname !== " " && <ListItemText primary={obj.teamname} />}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className='sidebar-plus-btn' onClick={addTeamNamesWrite}>ADD</div>
                    </div>
                    {
                        !writeUserSelected ? <div className='user-details-error'>Atleast one corpus is required </div> : null
                    }
                    {
                        errorMsg ? <div className='user-details-error'>{errorMsg} </div> : null
                    }
                    {
                        successWrite ? <div className='user-details-success max-width'>{successWrite}</div> : null

                    }
                    {
                        successWriteSecondMsg ? <div style={{ marginTop: '-18px' }} className='user-details-success max-width'>{successWriteSecondMsg}</div> : null

                    }

                    <div className="users-sidebar-existing-user-container">
                        {
                            userListWrite && userListWrite.map((cor, index) =>
                                <div className='users-single-user' key={index}>
                                    <div className='mx-width'>  {cor}</div>
                                    <div onClick={(e) => deleteUser(cor, 'write')} className="remove-user">-</div>
                                </div>)
                        }
                        {userListWrite.length === 0 ? <div className='no-corpus-found'>No Corpus found</div> : null}

                    </div>
                    <div className='line'></div>
                    <h4 className='users-sidebar-middle-heading'>Teams with read access</h4>
                    <div className="users-sidebar-select-user custom-width-29vw ">
                        <FormControl size="small" fullWidth sx={{ m: 0, maxWidth: '29vw' }}>
                            <InputLabel id="demo-multiple-checkbox-label2">Add corpus</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label2"
                                id="demo-multiple-checkbox2"
                                multiple
                                value={selectedValuesRead}
                                input={<OutlinedInput label="Add corpus" />}
                                onChange={handleChangeRead}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                fullWidth
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            >
                                {userArr2.map((obj, index) => (
                                    <MenuItem
                                        key={index}
                                        value={obj.teamname}
                                    >
                                        {obj.teamname !== " " && <Checkbox checked={selectedValuesRead.indexOf(obj.teamname) > -1} />}
                                        {obj.teamname !== " " && <ListItemText primary={obj.teamname} />}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className='sidebar-plus-btn' onClick={addTeamNamesRead}>ADD</div>
                    </div>
                    {
                        !readUserSelected ? <div className='user-details-error'>Atleast one corpus is required </div> : null
                    }
                    {
                        errorMsgRead ? <div className='user-details-error'>{errorMsgRead} </div> : null
                    }
                    {
                        successRead ? <div className='user-details-success max-width'>{successRead}</div> : null
                    }
                    {
                        successReadSecondMsg ? <div style={{ marginTop: '-18px' }} className='user-details-success max-width'>{successReadSecondMsg}</div> : null
                    }
                    <div className="users-sidebar-existing-user-container">
                        {
                            userListRead.length > 0 && userListRead.map((cor, index) =>
                                <div className='users-single-user' key={index}>
                                    <div className='mx-width'>  {cor}</div>
                                    <div onClick={(e) => deleteUser(cor, 'read')} className="remove-user">-</div>
                                </div>)
                        }
                        {userListRead.length === 0 ? <div lassName='no-corpus-found'>No Corpus found</div> : null}
                    </div>
                </div>

            </div>
        </Drawer>
    )
}
