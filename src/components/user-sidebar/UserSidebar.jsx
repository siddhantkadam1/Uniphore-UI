import React from 'react'
import '../user-sidebar/user-sidebar.css'
import { Drawer } from '@mui/material'
import { useContext, useState, useEffect } from 'react'
import { PanelContext } from '../../context/panelContext'
import crossIcon from "../../../src/assets/cancel_FILL0_wght400_GRAD0_opsz48.png";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'
import { env } from '../../environments'
import { useSnackbar } from '../../context/snackbarContext'
import { useSpinner } from '../../context/spinnerContext'


const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function UserSidebar() {
    const { setFlag } = useSpinner();
    const { msg, setMsg, success, setSuccess, setOpen, open } = useSnackbar();
    const [selectedValues, setSelectedValues] = useState([]);
    const { toggle, setToggle } = useContext(PanelContext)
    const [flip, setFlip] = useState(false);
    const [call, setCall] = useState(0);
    const [existingUser, setExistingUser] = useState(0);
    const [user, setUser] = useState('');
    const [writeUser, setWriteUser] = useState('');
    const [userExist, setUserExist] = useState('');
    const [notFilled, setNotFilled] = useState(false);
    const [notFilledAdd, setNotFilledAdd] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [users, setUsers] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',

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


    let userArr = [
        'John',
        'Austin',
        'Sam'
    ];

    let userArr2 = [
        'John1',
        'Austin1',
        'Sam1'
    ];

    const handleChangeuser = (e) => {
        let { name, value } = e.target;
        if (name == 'read') {
            setUser(value);
        } else if (name == 'write') {
            setWriteUser(value);
        }
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setUsers({ ...users, [name]: value });
    }

    const onSubmit = (e) => {
        console.log('temas obj', users);
    }

    const deleteUser = (userName) => {
        // let payload = {};
        // payload['user_name'] = userName;
        // payload['teamname'] = teamName;
        // axios.post(`${env.BASE_URL}:${env.PORT}/udops/team/remove_users/`, payload)
        //     .then(res => {
        //         setCallExistingUserApi(prev => prev + 1);
        //     }).catch(err => {
        //         console.log(err);
        //     })
    }

    const isAllDataFilled = () => {
        for (let key in users) {
            if (!users[key].trim()) {
                return false;
            }
        }
        return true;
    }

    const isValidEmail = () => {
        if (emailRegex.test(users['email'].trim())) {
            setInvalidEmail(false);
            return true;
        } else {
            setInvalidEmail(true);
            return false;
        }
    }

    const addUsers = (e) => {
        console.log(users);
        if (isAllDataFilled()) {
            setNotFilled(false);
            setNotFilledAdd(false);
        } else {
            setNotFilled(true);
            setNotFilledAdd(true);
            return;
        }
        if (!isValidEmail()) {
            return;
        }

        if (toggle.isEditUsers) {
            let payload = { ...users };
            payload['existing_user_name'] = existingUser;
            payload['new_user_name'] = users.username;
            let { username, ...rest } = payload;
            // setFlag shows/hides the global spinner 
            setFlag(true);
            axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/upsert_user/ `, rest)
                .then(res => {
                    setFlag(false);
                    if (res.data.status.includes('success')) {
                        setToggle({ ...toggle, callUsersListApi: toggle.callUsersListApi + 1 });
                        setExistingUser(users.username)
                        setMsg('User updated successfully!');
                        setSuccess('success');
                        setOpen(true);
                    } else {
                        setMsg('Something went wrong');
                        setSuccess('error');
                        setOpen(true);
                    }

                }).catch(err => {
                    console.log(err);
                    setMsg('Something went wrong');
                    setSuccess('error');
                    setOpen(true);
                    setFlag(false);
                })
        } else {
            let payload = {};
            payload = users;
            payload['user_name'] = users.username;
            let { username, ...rest } = payload;
            setFlag(true);
            axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/add_user/ `, rest)
                .then(res => {
                    setFlag(false);
                    if (res.data.data.includes('User already exists')) {
                        setMsg('User already Exists');
                        setSuccess('error');
                        setOpen(true);
                        return;
                    }
                    if (res.data.status.includes('success')) {
                        setToggle({ ...toggle, callUsersListApi: toggle.callUsersListApi + 1 });
                        setMsg('User added successfully');
                        setSuccess('success');
                        setOpen(true);
                    }
                }).catch(err => {
                    setMsg('Something went wrong');
                    setSuccess('error');
                    setOpen(true);
                    setFlag(false);
                    console.log(err);
                })
        }
    }

    const closeSidebarAndResetEverything = (e) => {
        setToggle(
            {
                ...toggle, isUserDrawerOpen: false,
                isEditUsers: false
            }
        )
        setNotFilled(false)
        setNotFilledAdd(false)
        setInvalidEmail(false)
        clearForm()
    }

    const clearForm = (e) => {
        setUsers({
            firstname: '',
            lastname: '',
            email: '',
            username: '',
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

    useEffect(()=>{
      closeSidebarAndResetEverything();
    },[toggle.callUsersListApi])

    useEffect(() => {

        if (toggle.isEditUsers) {
            let patchObj = {};
            patchObj = toggle.userDetailsObj;
            let { user_name, ...rest } = patchObj;
            rest['username'] = toggle.userDetailsObj.user_name;
            setUsers(rest)
            setExistingUser(toggle.userDetailsObj.user_name)
            setNotFilled(true);
            setNotFilledAdd(false);
            setInvalidEmail(false);
        } else {
            setUsers({
                firstname: '',
                lastname: '',
                email: '',
                username: '',
            })
            setExistingUser('')
            setNotFilled(false);
            setNotFilledAdd(false);
            setInvalidEmail(false);
        }

    }, [toggle.isEditUsers]);


    return (
        <Drawer anchor='right' open={toggle.isUserDrawerOpen} >
            <div className="users-sidebar-wrapper">
                <div className="users-sidebar-header">
                    {
                        toggle.isEditUsers
                            ?
                            <p className="users-panel-title">Edit user  </p>
                            :
                            <p className="users-panel-title">Add new user  </p>
                    }
                    <div className="cross" onClick={(e) => {
                        setToggle(
                            {
                                ...toggle, isUserDrawerOpen: !toggle.isUserDrawerOpen,
                                isEditUsers: false
                            }
                        )
                        setNotFilled(false)
                        setNotFilledAdd(false)
                        setInvalidEmail(false)
                        clearForm()
                    }
                    }>
                        <img src={crossIcon} alt='cancel' />
                    </div>
                </div>
                <div className="users-details-wrapper">
                    <div className="users-flex-col">
                        <div style={{ width: '49%' }}>
                            <TextField
                                name='username'
                                onChange={handleChange}
                                value={users.username ?? ""}
                                autoComplete='off' size="small" fullWidth id="outlined-basic"
                                label="Github Username" variant="outlined"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </div>
                        <div className='users-two-col'>
                            <TextField
                                name='firstname'
                                onChange={handleChange}
                                value={users.firstname ?? ""}
                                autoComplete='off' size="small" fullWidth id="outlined-basic" label="First Name" variant="outlined"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            />

                            <TextField
                                name='lastname' className='sidebar-labels'
                                onChange={handleChange}
                                value={users.lastname ?? ""}
                                autoComplete='off' size="small" fullWidth id="outlined-basic" label="Last Name" variant="outlined"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </div>

                        <div>
                            <TextField
                                name='email'
                                onChange={handleChange}
                                value={users.email ?? ""}
                                autoComplete='off' size="small" fullWidth id="outlined-basic" label="Email ID" variant="outlined"
                                sx={{
                                    '& .MuiFormLabel-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </div>
                        <div>
                            {
                                notFilledAdd ? <div className='fill-all-details'>Please fill in all  fields</div> : null
                            }
                        </div>
                        <div>
                            {
                                invalidEmail ? <div className='fill-all-details'>Invalid email </div> : null
                            }
                        </div>
                    </div>
                    {/* <div className='line'></div> */}
                    {/* <h4 className='users-sidebar-middle-heading'>Corpus with write access</h4>
                    <div className="users-sidebar-select-user ">
                        <TextField
                            label="Add Corpus"
                            select
                            value={user ?? ""}
                            onChange={handleChangeuser}
                            fullWidth
                            size="small"
                            name='read'
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {userArr.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}

                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div className='sidebar-plus-btn'>ADD</div>
                    </div> */}
                    {/* <div className="users-sidebar-existing-user-container">
                        {
                            userList.map(cor =>
                                <div className='users-single-user' key={cor.corpus_name}>
                                    <div className='mx-width'>  {cor.corpus_name}</div>
                                    <div onClick={(e) => deleteUser(cor.corpus_name)} className="remove-user">-</div>
                                </div>)
                        }
                    </div> */}
                    {/* <div className='line'></div>
                    <h4 className='users-sidebar-middle-heading'>Corpus with read access</h4>
                    <div className="users-sidebar-select-user ">
                        <TextField
                            label="Add Corpus"
                            select
                            value={writeUser ?? ""}
                            onChange={handleChangeuser}
                            fullWidth
                            size="small"
                            name='write'
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {userArr2.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}

                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div className='sidebar-plus-btn'>ADD</div>
                    </div>
                    <div className="users-sidebar-existing-user-container">
                        {
                            userList.map(cor =>
                                <div className='users-single-user' key={cor.corpus_name}>
                                    <div className='mx-width'>  {cor.corpus_name}</div>
                                    <div onClick={(e) => deleteUser(cor.corpus_name)} className="remove-user">-</div>
                                </div>)
                        }
                    </div> */}
                </div>
                <div className="panel-bottom">
                    <div className="btn-container">
                        <button onClick={
                            () => { setFlip((prev) => !prev); addUsers() }
                        } className="panel-edit-btn">SAVE</button>
                        {/* <button onClick={() => setToggle({ ...toggle, isUserDrawerOpen: !toggle.isUserDrawerOpen })} className="panel-cancel-btn">CANCEL</button> */}
                    </div>
                </div>
            </div>
        </Drawer >
    )
}
