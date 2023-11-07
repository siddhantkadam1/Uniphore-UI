
import '../data-set-panel/dataset-panel.css'
import '../user-management-panel/user-management-panel.css'
import crossIcon from "../../../src/assets/cancel_FILL0_wght400_GRAD0_opsz48.png";
import { useState, useContext, useEffect, useLayoutEffect } from "react";

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, ListItemText } from '@mui/material';
import { padding } from "@mui/system";
import { PanelContext } from "../../context/panelContext";
import { SearchContext } from '../../context/searchContext'
import axios from 'axios';
import { env } from "../../environments";
import { useSnackbar } from '../../context/snackbarContext';
import { useSpinner } from '../../context/spinnerContext';
import { AES, enc } from 'crypto-js';


const dummySummary = [
    {
        key: "template_file_path",
        value: "\\hinglish\\template_hinglish.py"
    },
    {
        key: "native_schema",
        value: "\\hinglish\\native_schema.json"
    },
    {
        key: "common_schema",
        value: "\\hinglish\\common_schema.json"
    },
]

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

function UserManagementPanel() {
    const { setFlag } = useSpinner();
    const [selectedValues, setSelectedValues] = useState([]);
    const [adminArr, setAdminArr] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [existingAdminArr, setExistingAdminArr] = useState([]);
    const { msg, setMsg, success, setSuccess, setOpen, open } = useSnackbar();
    const { toggle, setToggle } = useContext(PanelContext)
    const [deleteError, setDeleteError] = useState(false);
    const [call, setCall] = useState(0);
    const [flip, setFlip] = useState(false)
    const [user, setUser] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState('');
    const [noUsersFound, setNoUsersFound] = useState(false);
    const [updateSuccess, setupdateSuccess] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const [admin, setAdmin] = useState('');
    const [teamName, setTeamName] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [notFilled, setNotFilled] = useState(false);
    const [token, setToken] = useState('');
    const [s3pah, setS3path] = useState('');
    const [mount_location, setMountLocation] = useState('');
    const [commons3pah, setCommonS3path] = useState('');
    const [successUser, setSuccessUser] = useState('');
    const [userArr, setUserArr] = useState([]);
    const [userArrPresent, setUserArrPresent] = useState(false);
    const [callExistingUserApi, setCallExistingUserApi] = useState(0);
    const [existingteam, setExistingTeam] = useState();
    const [teams, setTeams] = useState({
        new_teamname: '',
        tenant_id: '',
        admin: '',
        tenant_name: '',
        permanent_access_token: '',
        base_path: '',

    })
    const [userList, setUserList] = useState([])

    const handleChangeuser = (e) => {
        setUser(e.target.value);
    }


    const handleChangAdmin = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedValues(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setTeams({ ...teams, [name]: value })
        if (name == 'new_teamname') {
            setTeamName(value);
        } else if (name == 'tenant_id') {
            setTenantName(value);
        } else if (name == 'permanent_access_token') {
            setToken(value);
        } else if (name == 'base_path') {
            setS3path(value);
        } else if (name == 'mount_location') {
            setMountLocation(value);
        }
    }
    const isAllDataFilled = (rest) => {
        for (let key in rest) {
            if (!rest[key]) {
                return false;
            }
        }
        return true;
    }

    const upsertTeam = (e) => {
        // is user is not an admin,don't allow him to delete the team 
        if (!isAdmin()) {
            setMsg("Access Denied:You must be an admin of this team to edit this team")
            setSuccess('error');
            setOpen(true);
            return;
        }
        let payload = {};
        payload = { ...teams }
        payload['existing_teamname'] = existingteam;
        payload['s3_base_path'] = teams.base_path;
        payload['s3_destination_path'] = teams.mount_location;
        let { admin, base_path, tenant_name, mount_location, ...rest } = payload;
        let { tenantName, ...restData } = rest;
        if (isAllDataFilled(restData)) {
            setNotFilled(false);
        } else {
            setNotFilled(true);
            return;
        }
        // setFlag shows/hides the global spinner 
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/upsert/`, restData)
            .then(res => {
                setFlag(false);
                if (res.data.data.includes('Update successful')) {
                    setExistingTeam(restData.new_teamname)
                    setCallExistingUserApi(prev => prev + 1);
                    // close the sidebar and call teamplist api (i.e. callTeamsListApi: toggle.callTeamsListApi + 1) ,also reset the user in the dropdown
                    setUser('')
                    setToggle({ ...toggle, callTeamsListApi: toggle.callTeamsListApi + 1, uacToggle: !toggle.uacToggle });
                    setupdateSuccess(true);
                    setTimeout(() => {
                        setupdateSuccess(false);
                    }, 1800);
                    setMsg('Team updated successfully!');
                    setSuccess('success');
                    setOpen(true);
                } else if (res.data.data.includes('Invalid admin user_name')) {
                    setInvalidUser(true);
                    setTimeout(() => {
                        setInvalidUser(false);
                    }, 1800);
                    setupdateSuccess(false);
                    setMsg('Invalid admin username');
                    setSuccess('error');
                    setOpen(true);
                } else {
                    setInvalidUser(false);
                    setupdateSuccess(false);
                }
            }).catch(err => {
                console.log(err);
                setMsg('Something went wrong');
                setSuccess('error');
                setOpen(true);
                setFlag(false);
            })
    }

    useEffect(() => {
        if (toggle.isEdit == true) {
            setFlip(true);
        } else {
            setFlip(false);
        }
    }, [toggle.uacObj, toggle.isEditUac]);

    useEffect(() => {
        setExistingTeam(toggle.uacObj.teamname)
        setAdmin(toggle.uacObj.admin_user_name);
        setTeamName(toggle.uacObj.teamname);
        setTenantName(toggle.uacObj.tenant_id);
        setToken(toggle.uacObj.permanent_access_token);
        setS3path(toggle.uacObj.s3_base_path)
        setMountLocation(toggle.uacObj.s3_destination_path)
        setTeams(
            {
                ...teams,
                new_teamname: toggle.uacObj.teamname,
                tenant_id: toggle.uacObj.tenant_id,
                admin: toggle.uacObj.admin_user_name,
                permanent_access_token: toggle.uacObj.permanent_access_token,
                base_path: toggle.uacObj.s3_base_path,
                mount_location: toggle.uacObj.s3_destination_path
            }
        )
        // setSummary(dummySummary);
        // let JsonFormData = {};
        // dummySummary.map(obj => {
        //     JsonFormData[obj.key] = obj.value;
        // })
        // console.log(JsonFormData);
        // setSummaryState(JsonFormData)

        // axios.post(`${env.BASE_URL}:${env.PORT}/udops/dataset/summary/`,
        //     {
        //         dataset_name: toggle.obj.dataset_name,
        //     }
        // )
        //     .then(res => {
        //         if (res) {
        //             setSummary(res.data);
        //             let JsonFormData = {};
        //             res.data.map(obj => {
        //                 JsonFormData[obj.key] = obj.value;
        //             })
        //             setSummaryState(JsonFormData)
        //         }
        //     })
        //     .catch(error => {

        //     });

    }, [toggle.uacObj.teamname])

    const showMessage = (message, success) => {
        setMsg(message);
        setSuccess(success);
        setOpen(true);
    };

    const isAdmin = () => {
        if (!adminArr) return false;
        for (let admin of existingAdminArr) {
            if (admin == loggedInUser) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        if (localStorage.getItem('encryptedData')) {
            const encryptedData = localStorage.getItem('encryptedData');
            const decryptedData = AES.decrypt(encryptedData, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8)
            const parsedData = JSON.parse(decryptedData);
            const userName = parsedData?.user_data[0]?.user_name;
            setLoggedInUser(userName);
        }
    }, [localStorage.getItem('encryptedData')]);


    const deleteUser = (userName) => {
        // is user is not an admin,don't allow him to delete the team 
        if (!isAdmin()) {
            showMessage('Access Denied:You must be an admin of this team to delete a user', 'error');
            return;
        }
        let payload = {};
        payload['user_name'] = userName;
        payload['teamname'] = teamName;
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/remove_users/`, payload)
            .then(res => {
                setFlag(false);
                if (res.data?.status.includes('Data Deleted Successfully !!!')) {
                    showMessage('User deleted successfully!', 'success');
                    setCallExistingUserApi(prev => prev + 1);
                } else if (res.data?.status.includes('Teamname is not valid!')) {
                    showMessage('Invalid team name', 'error');
                } else {
                    showMessage('Something went wrong', 'error');
                }
            }).catch(err => {
                console.log(err);
                setFlag(false);
                showMessage('Something went wrong', 'error');
            })
    }

    const deleteAdmin = (adminName) => {
        // is user is not an admin,don't allow him to delete the admin 
        if (!isAdmin()) {
            showMessage('Access Denied:You must be an admin of this team to delete an admin', 'error');
            return;
        }
        let payload = {};
        payload['user_name'] = adminName;
        payload['teamname'] = teamName;
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/remove_admin/`, payload)
            .then(res => {
                setFlag(false);
                if (res.data?.status && res.data.status.includes('success')) {
                    // call existing users api also 
                    getExistingUsers();
                    showMessage('Admin(s) deleted successfully!', 'success');
                    getExistingAdminList();
                    setToggle({ ...toggle, callTeamsListApi: toggle.callTeamsListApi + 1, });
                } else if (res.status.includes('Teamname is not valid!')) {
                    showMessage('Invalid team name', 'error');
                } else {
                    showMessage('Something went wrong', 'error');
                }
            }).catch(err => {
                console.log(err);
                setFlag(false);
                showMessage('Something went wrong', 'error');
            })
    }


    const addUser = (e) => {
        if (noUsersFound) {
            return;
        }
        if (!user) {
            return;
        }
        // is user is not an admin,don't allow him to add a user 
        if (!isAdmin()) {
            showMessage('Access Denied:You must be an admin of this team to add a user to tenant', 'error');
            return;
        }
        let payload = {};
        payload['user_name'] = user;
        payload['teamname'] = existingteam;
        // setFlag shows/hides the global spinner 
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/add_users_team/`, payload)
            .then(res => {
                setFlag(false);
                if (res.data.status.includes('success')) {
                    showMessage('User added successfully!', 'success');
                    setCallExistingUserApi(prev => prev + 1);
                } else if (res.data.status.includes('error')) {
                    showMessage('User already exists', 'error');
                }
                else {
                    showMessage('Something went wrong', 'error');
                }
            }).catch(err => {
                showMessage('Something went wrong', 'error');
                setFlag(false);
                console.log(err);
            })
    }


    const addAdmin = (e) => {
        if (selectedValues.length == 0) {
            return;
        }
        // is user is not an admin,don't allow him to add an admin 
        if (!isAdmin()) {
            setMsg("Access Denied:You must be an admin of this team to add an admin")
            setSuccess('error');
            setOpen(true);
            return;
        }
        let payload = {};
        payload['user_name'] = selectedValues;
        payload['teamname'] = existingteam;
        // setFlag shows/hides the global spinner 
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/admin_upsert/`, payload)
            .then(res => {
                setFlag(false);
                setOpen(true);
                if (res.data.status.includes('success')) {
                    setMsg('Admin(s) added successfully!');
                    setSuccess('success');
                    getExistingAdminList();
                    // call existing users api also 
                    getExistingUsers();
                    // call team list api after adding admin(s) 
                    setToggle({ ...toggle, callTeamsListApi: toggle.callTeamsListApi + 1 });
                } else if (res.data.status.includes('error')) {
                    let errorStr = " ";
                    if (res.data.data && res.data.data.length > 0) {
                        errorStr = 'Admin(s) ' + res.data.data.join() + ' already added'
                        getExistingAdminList();
                    } else {
                        errorStr = 'Something went wrong'
                    }
                    setMsg(errorStr);
                    setSuccess('error');
                }
                else {
                    setMsg('Something went wrong');
                    setSuccess('error');
                }
            }).catch(err => {
                setMsg('Something went wrong');
                setSuccess('error');
                setOpen(true);
                setFlag(false);
                console.log(err);
            })
    }


    const getAdminList = (e) => {
        axios.get(`${env.BASE_URL}:${env.PORT}/udops/user/list/`)
            .then(res => {
                let admins = res.data?.data;
                if (admins && admins.length > 0) {
                    setAdminArr(admins.filter(obj => obj.user_name !== " "))
                } else {
                    setAdminArr([]);
                }
            })
            .catch(error => {
                setAdminArr([]);
            });
    }

    const getExistingAdminList = (e) => {
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/list_admin/`, { teamname: toggle.uacObj.teamname })
            .then(res => {
                if (res.data.status = 'success') {
                    let admins = res.data?.message;
                    if (admins && admins.length > 0) {
                        setExistingAdminArr(admins)
                    } else {
                        setExistingAdminArr([]);
                    }
                } else {
                    setExistingAdminArr([]);
                }
            })
            .catch(error => {
                setExistingAdminArr([]);
            });
    }

    const getExistingUsers = () => {
        let payload = {};
        payload['teamname'] = toggle.uacObj.teamname;
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/existing_users/`, payload)
            .then(res => {
                if (res.data.data == null) {
                    setNoUsersFound(true);
                } else {
                    setNoUsersFound(false);
                }
                let users = res.data.data[0].usernames;
                setUserList(users);
            })
            .catch(error => {
                setUserList([]);
            });
    }


    useEffect(() => {
        if (!toggle.uacToggle) {
            setNotFilled(false);
            axios.get(`${env.BASE_URL}:${env.PORT}/udops/user/list/`)
                .then(res => {
                    let users = res.data?.data;
                    setUserArr(users);
                })
                .catch(error => {
                    setUserArr([]);
                });
            // admin list api call 
            getAdminList();
            getExistingAdminList();
        }

    }, [toggle.uacObj.teamname, toggle.uacToggle])

    useEffect(() => {
        getExistingUsers();
    }, [toggle.uacObj.teamname, callExistingUserApi])

    return (

        <div className={`panel-main-container ${toggle.uacToggle ? 'allowClicks' : 'blockClicks'}`}  >
            <div className={`panel-container ${toggle.uacToggle ? 'panel-container ' : 'show'}`}>
                <div className="sidebar-wrapper">
                    <div className="sidebar-header">
                        <p className="panel-title">Edit team  </p>
                        <div className="cross" onClick={(e) => {
                            setUser('')
                            setToggle({ ...toggle, uacToggle: !toggle.uacToggle })
                            setSelectedValues([]);
                        }}>
                            <img src={crossIcon} alt='cancel' />
                        </div>
                    </div>
                    <div className="details-wrapper">
                        <div className="flex-col">
                            <div>
                                <TextField
                                    name='new_teamname'
                                    onChange={handleChange}
                                    value={teamName ?? ''}
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    required autoComplete='off' size="small" fullWidth id="outlined-basic" label="Existing Team Name" variant="outlined" />
                            </div>
                            <div>
                                <TextField
                                    name='tenant_id' className='sidebar-labels'
                                    onChange={handleChange}
                                    value={tenantName ?? ''}
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    required autoComplete='off' size="small" fullWidth id="outlined-basic" label="Tenant Name" variant="outlined" />
                            </div>
                            <div>
                                <TextField
                                    name='permanent_access_token'
                                    onChange={handleChange}
                                    value={token ?? ''}
                                    type="password"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    required autoComplete='off' size="small" fullWidth id="outlined-basic"
                                    label="Permanent Access Token(duplo)" variant="outlined" />
                            </div>
                            <div>
                                <TextField
                                    name='base_path'
                                    value={s3pah ?? ''}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    required autoComplete='off' size="small" fullWidth id="outlined-basic" label="s3 Repository Path" variant="outlined" />
                            </div>
                            <div>
                                <div>
                                    <TextField
                                        name='mount_location'
                                        value={mount_location ?? ''}
                                        onChange={handleChange}
                                        required autoComplete='off' size="small" fullWidth
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        id="outlined-basic" label="s3 Working Bucket" variant="outlined" />
                                </div>
                            </div>
                            {
                                notFilled ? <div className='fill-all-details'>Please fill in all the required fields</div> : null
                            }
                        </div>
                        <h3 className='sidebar-middle-heading'>Add user to tenant</h3>
                        <div className="sidebar-select-user ">
                            {!noUsersFound && <TextField
                                label="Select User"
                                select
                                value={user}
                                onChange={handleChangeuser}
                                fullWidth
                                size="small"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            >
                                {userArr.map((user) => (
                                    <MenuItem
                                        key={user.user_name}
                                        value={user.user_name}
                                    >
                                        {user.user_name}
                                    </MenuItem>
                                ))}
                            </TextField>}
                            {noUsersFound ? <div>No users found</div> : null}
                            <div className='sidebar-plus-btn' onClick={addUser}>ADD</div>
                        </div>
                        <div className="sidebar-existing-user-container">
                            <h3 className='existing-user'>Existing Users</h3>
                            {
                                userList.length > 0
                                    ?
                                    userList.map((u, index) =>
                                        <div className='single-user' key={index}>
                                            <div> {u}</div>
                                            <div onClick={(e) => deleteUser(u)} className="remove-user">-</div>
                                        </div>
                                    )
                                    :
                                    <div className='no-users-found'>
                                        No users found.
                                    </div>
                            }
                        </div>

                        {/* admin dropdown  */}
                        <h3 className='sidebar-middle-heading mt'>Add admin</h3>
                        <div className="users-sidebar-select-user custom-width-29vw">
                            <FormControl size="small" fullWidth sx={{ m: 0, maxWidth: '29vw' }}>
                                <InputLabel sx={{ fontSize: '14px' }} id="demo-multiple-checkbox-label">Add Admin</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedValues}
                                    input={<OutlinedInput label="Add corpus" />}
                                    onChange={handleChangAdmin}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                    fullWidth
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                >
                                    {adminArr.map((obj, index) => (
                                        <MenuItem
                                            key={index}
                                            value={obj.user_name}
                                        >
                                            {obj.user_name !== " " && <Checkbox checked={selectedValues.indexOf(obj.user_name) > -1} />}
                                            {obj.user_name !== " " && <ListItemText primary={obj.user_name} />}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div className='sidebar-plus-btn' onClick={addAdmin}>ADD</div>
                        </div>
                        <div className="sidebar-existing-user-container">
                            <h3 className='existing-user' style={{ marginTop: '-14px' }}>Existing Admins</h3>
                            {
                                existingAdminArr.length > 0
                                    ?
                                    existingAdminArr.map((u, index) =>
                                        <div className='single-user' key={index}>
                                            <div> {u}</div>
                                            <div onClick={(e) => deleteAdmin(u)} className="remove-user">-</div>
                                        </div>
                                    )
                                    :
                                    <div className='no-users-found'>
                                        No existing admins found.
                                    </div>
                            }
                            {
                                // deleteError ? <div className='no-users-found'>
                                //     {deleteError}
                                // </div> : null
                            }
                        </div>
                        {/* admin dropdown  */}
                    </div>
                    <div className="panel-bottom">
                        <div className="btn-container">
                            <button onClick={() => { setFlip((prev) => !prev); upsertTeam(); }} className="panel-edit-btn">SAVE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default UserManagementPanel;







