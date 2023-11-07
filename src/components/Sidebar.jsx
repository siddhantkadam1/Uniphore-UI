import React from 'react'
import '../styles/sidebar.css'
import { Drawer } from '@mui/material'
import { useContext, useState, useEffect } from 'react'
import { PanelContext } from '../context/panelContext'
import crossIcon from "../../src/assets/cancel_FILL0_wght400_GRAD0_opsz48.png";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { Select, Checkbox, ListItemText,FormControl } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'
import { env } from '../environments'
import { useSpinner } from '../context/spinnerContext'
import SharedSnacbar from '../common-components/SharedSnackbar'
import { AES, enc } from 'crypto-js';
import { useSnackbar } from '../context/snackbarContext'

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

export default function Sidebar() {
    const [username, setUsername] = useState('');
    const [selectedValues, setSelectedValues] = useState([]);
    const [adminArr, setAdminArr] = useState([]);
    const { setFlag } = useSpinner();
    const { msg, setMsg, success, setSuccess, setOpen, open } = useSnackbar();
    const { toggle, setToggle } = useContext(PanelContext)
    const [flip, setFlip] = useState(false);
    const [call, setCall] = useState(0);
    const [user, setUser] = useState('');
    const [noTeamName, setNoTeamName] = useState(false);
    const [noAdmin, setnoAdmin] = useState(false);
    const [teamAdded, setTeamAdded] = useState(false);
    const [teamAlreadyExists, setTeamAlreadyExists] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const [invalidTeam, setInvalidTeam] = useState(false);
    const [notFilled, setNotFilled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState(false);
    const [fail, setFail] = useState(false);
    const [userArr, setUserArr] = useState([]);
    const [teams, setTeams] = useState({
        team_name: '',
        tenant_name: '',
        tenant_name: '',
        access_token: '',
        base_path: '',

    })
    const [userList, setUserList] = useState(
        [
            {
                corpus_name: 'corpus 1'
            },
            {
                corpus_name: 'corpus 2'
            },
            {
                corpus_name: 'corpus 3'
            },
            {
                corpus_name: 'corpus 4'
            },
        ]
    )

    const handleChangAdmin = (event)=>{
        const {
            target: { value },
        } = event;
        setSelectedValues(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const handleChangeuser = (e) => {
        setUser(e.target.value);
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setTeams({ ...teams, [name]: value });
    }

    const onSubmit = (e) => {
        console.log('temas obj', teams);
    }
    const closeSidebar = (e) => {
        setToggle({ ...toggle, isDrawerOpen: !toggle.isDrawerOpen })
        setCall(0);
        clearForm();
    }
    const addLoggedInUserToTeam = (e) => {
        let payload = {};
        payload['user_name'] = username;
        payload['teamname'] = teams.team_name;
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/add_users_team/`, payload)
            .then(res => {
                setFlag(false);
                if (res.data.data.includes('Invalid Username')) {
                    setMsg('Invalid Username');
                    setSuccess('error');
                    setOpen(true);
                    return;
                } else {
                    setInvalidUser(false);
                }

                if (res.data.data.includes('Invalid teamname')) {
                    setMsg('Invalid Teamname');
                    setSuccess('error');
                    setOpen(true);
                    return;

                } else {
                    setInvalidTeam(false);
                }
                setMsg('User added successfully!');
                setSuccess('success');
                setOpen(true);
                closeSidebar();
                // setCallExistingUserApi(prev => prev + 1);
            }).catch(err => {
                console.log(err);
                setLoading(false);
                setResponseMsg(false)
                setMsg(err.message)
                setSuccess('error');
                setOpen(true);
                setFlag(false);
            })
    }

    const isAllDataFilled = () => {
        console.log('selected values',selectedValues);
        console.log(teams,'teams');
        for (let key in teams) {
            if (!teams[key]) {
                return false;
            }
        }
        if(selectedValues.length==0){
            return false;
        }
        return true;
    }

    useEffect(() => {
        if (toggle.isEdit == true) {
            setFlip(true);
        } else {
            setFlip(false);
        }
    }, [toggle.obj, toggle.isEdit]);

    const addTeam = (e) => {
        if (isAllDataFilled()) {
            setNotFilled(false);
            setNoTeamName(false);
        } else {
            setNotFilled(true);
            return;
        }
        setInvalidTeam(false);
        setFlag(true);
        let payload = {};
        payload = { ...teams }
        payload['admin_user_name'] = selectedValues;
        payload['s3_base_path'] = teams.base_path;
        payload['tenant_id'] = teams.tenant_name;
        payload['teamname'] = teams.team_name;
        payload['permanent_access_token'] = teams.access_token;
        payload['s3_destination_path'] = teams.mount_location;
        let { admin, base_path, tenant_name, team_name, access_token, mount_location, ...rest } = payload;
        console.log('rest', rest);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/add_team/`, rest)
            .then(res => {
                // setCallExistingUserApi(prev => prev + 1);
                setFlag(false);
                if (res.data.data.includes('Admin user not found')) {
                    setMsg('Admin user not found');
                    setSuccess('error');
                    setOpen(true);
                    return;
                } else {
                    setnoAdmin(false);
                }

                if ( res.data.data && res.data.data.includes('Team added successfully')) {
                    setToggle({ ...toggle, callTeamsListApi: toggle.callTeamsListApi + 1 });
                    setMsg('Team added successfully!');
                    setSuccess('success');
                    setOpen(true);
                    addLoggedInUserToTeam();
                    return;
                } else {
                    setTeamAdded(false);
                }

                if (res.data.data.includes('Teamname already exists!!!')) {
                    setMsg('Team name already exists!');
                    setSuccess('error');
                    setOpen(true);
                } else {
                    setTeamAlreadyExists(false);
                }
            }).catch(err => {
                console.log(err);
                setMsg(err.message)
                setSuccess('error');
                setOpen(true);
                setFlag(false);
            })
    }

    const clearForm = (e) => {
        setTeams({
            team_name: '',
            tenant_name: '',
            tenant_name: '',
            access_token: '',
            base_path: '',
        })
        setNotFilled(false);
        setTeamAlreadyExists(false);
        setUser('');
        setNoTeamName(false);
        setInvalidTeam(false);
        setSelectedValues([]);

    }


   const getAdminList = (e)=>{
    axios.get(`${env.BASE_URL}:${env.PORT}/udops/user/list/`)
        .then(res => {
            let admins = res.data?.data;
            setAdminArr(admins.filter(obj => obj.user_name !== " "))
        })
        .catch(error => {
            setUserArr([]);
        });
 }

    useEffect(() => {
        if(toggle.isDrawerOpen){
            // api call 
            getAdminList();
        }
    }, [toggle.isDrawerOpen])

    useEffect(() => {
        axios.get(`${env.BASE_URL}:${env.PORT}/udops/user/list/`)
            .then(res => {
                let users = res.data.data;
                setUserArr(users);
            })
            .catch(error => {

            });
    }, [])

    useEffect(() => {
        if (localStorage.getItem('encryptedData')) {
            const encryptedData = localStorage.getItem('encryptedData');
            const decryptedData = AES.decrypt(encryptedData, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8)
            const parsedData = JSON.parse(decryptedData);
            const userName = parsedData?.user_data[0]?.user_name;
            setUsername(userName);
        }
    }, [localStorage.getItem('encryptedData')]);

    return (
        <Drawer anchor='right' open={toggle.isDrawerOpen} >
            <div className="sidebar-wrapper">
                <div className="sidebar-header">
                    <p className="panel-title">Add new team  </p>
                    <div className="cross"
                        onClick={(e) => {
                            setToggle({ ...toggle, isDrawerOpen: !toggle.isDrawerOpen })
                            setCall(0);
                            clearForm();
                        }}>
                        <img src={crossIcon} alt='cancel' />
                    </div>
                </div>
                <div className="details-wrapper">
                    <div className="flex-col">
                        <div>
                            <TextField
                                name='team_name'
                                onChange={handleChange}
                                required autoComplete='off' size="small" fullWidth
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                id="outlined-basic" label="Team Name" variant="outlined" />
                        </div>
                        <div>
                            <FormControl size="small" fullWidth sx={{ m: 0, maxWidth: '29vw' }}>
                                <InputLabel sx={{ fontSize: '14px' }}  size='small' id="demo-multiple-checkbox-label">Add Admin</InputLabel>
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
                        </div>
                        <div>
                            <TextField
                                name='tenant_name' className='sidebar-labels'
                                onChange={handleChange}
                                required autoComplete='off' size="small" fullWidth
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                id="outlined-basic" label="Tenant Name" variant="outlined" />
                        </div>
                        <div>
                            <TextField
                                name='access_token'
                                onChange={handleChange}
                                required autoComplete='off' size="small" fullWidth
                                type="password"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                id="outlined-basic" label="Permanent Access Token(duplo)" variant="outlined" />
                        </div>
                        <div>
                            <TextField
                                name='base_path'
                                onChange={handleChange}
                                required autoComplete='off' size="small" fullWidth
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                id="outlined-basic" label="s3 Repository Path" variant="outlined" />
                        </div>
                        <div>
                            <TextField
                                name='mount_location'
                                onChange={handleChange}
                                required autoComplete='off' size="small" fullWidth
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                                id="outlined-basic" label="s3 Working Bucket" variant="outlined" />
                        </div>
                        {
                            notFilled ? <div className='fill-all-details'>Please fill in all the required fields</div> : null
                        }
                        {
                            noAdmin ? <div className='fill-all-details'>Pleas type in existing Admin name</div> : null
                        }
                    </div>
                </div>
                <div className="panel-bottom">
                    <div className="btn-container">
                        <button onClick={() => { setFlip((prev) => !prev); setCall(call + 1); addTeam() }} className="panel-edit-btn">SAVE</button>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
