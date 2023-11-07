import React from 'react'
import '../user-sidebar/user-sidebar.css'
import { Drawer } from '@mui/material'
import { useContext, useState, useEffect } from 'react'
import { PanelContext } from '../../context/panelContext'
import crossIcon from "../../../src/assets/cancel_FILL0_wght400_GRAD0_opsz48.png";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SharedSnacbar from '../../common-components/SharedSnackbar'
import axios from 'axios'
import { env } from '../../environments'
import { AES, enc } from 'crypto-js';
import { useSpinner } from '../../context/spinnerContext'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useSnackbar } from '../../context/snackbarContext'


export default function CloneSidebar() {
    const { msg, setMsg, success, setSuccess, setOpen, open } = useSnackbar();
    const { corpusState, setCorpusState } = useContext(PanelContext)
    const [team, setTeam] = useState([]);
    const [singleTeam, setSingleTeam] = useState('');
    const { flag, setFlag } = useSpinner();
    const { toggle, setToggle } = useContext(PanelContext)
    const [username, setUsername] = useState('');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ corpus_name: '', gita: '', teamname: '' })
    const [pullForm, setPullForm] = useState({ folder: '', corpus_name: '' })

    const [pullFormErrors, setPullFormErrors] = useState({
        folder: '',
        corpus_name: '',
    });

    const [cloneFormRrrors, setCloneFormErrors] = useState({
        gita: '',
        corpus_name: '',
        teamname: '',
    });

    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name == 'teamname') setSingleTeam(value);
    }
    const handleChangePull = (e) => {
        let { name, value } = e.target;
        setPullForm({ ...pullForm, [name]: value });
    }

    const trimValues = (obj) => {
        for (let key in obj) {
            if (obj[key]) {
                obj[key] = obj[key].trim();
            }
        }
    }

    const validatePullForm = (e) => {
        let isValid = true;
        let newErrors = { ...pullFormErrors };
        if (!pullForm.folder.trim()) {
            newErrors.folder = 'Foldername or filename is required'
            isValid = false;
        } else {
            newErrors.folder = ''
        }
        if (!pullForm.corpus_name.trim()) {
            newErrors.corpus_name = 'Corpus name is required'
            isValid = false;
        } else {
            newErrors.corpus_name = ''
        }
        setPullFormErrors(newErrors);
        return isValid;
    }
    const validateCloneForm = (e) => {
        let isValid = true;
        let newErrors = { ...cloneFormRrrors };
        if (!formData.gita) {
            newErrors.gita = 'Github Repository is required'
            isValid = false;
        } else {
            newErrors.gita = ''
        }
        if (!formData.corpus_name) {
            newErrors.corpus_name = 'Corpus name is required'
            isValid = false;
        } else {
            newErrors.corpus_name = ''
        }
        if (!formData.teamname) {
            newErrors.teamname = 'Team name is required'
            isValid = false;
        } else {
            newErrors.teamname = ''
        }
        setCloneFormErrors(newErrors);
        return isValid;
    }

    const clone = (e) => {
        if (step == 2) return;
        if (!validateCloneForm()) return;
        let payload = {};
        payload = { ...formData };
        payload['username'] = username;
        trimValues(payload);
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/clone/ `, payload)
            .then(res => {
                setOpen(true);
                setFlag(false);
                if (res.data?.status && res.data.status == 'success') {
                    setMsg('Cloned successfully!')
                    setSuccess('success');
                    setStep(step + 1);
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data.message)
                    setSuccess('error');
                } else {
                    setMsg('Failed to clone')
                    setSuccess('error');
                }
            }).catch(err => {
                console.log(err);
                setOpen(true);
                setMsg('Something went wrong')
                setSuccess('error');
                setFlag(false);
            })
    }

    const pull = (e) => {
        if (step == 1) return;
        if (!validatePullForm()) return;
        let payload = {};
        payload = { ...pullForm }
        payload['username'] = username;
        payload['teamname'] = formData.teamname;
        trimValues(payload);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/pull/`, payload)
            .then(res => {
                setOpen(true);
                setFlag(false);
                if (res.data?.status && res.data.status == 'success') {
                    setSuccess('success');
                    setMsg('Pulled successfully!')
                    closeSidebar();
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data.message)
                    setSuccess('error');
                } else {
                    setMsg('Something went wrong')
                    setSuccess('error');
                }
            })
            .catch(error => {
                setOpen(true);
                setMsg('Something went wrong')
                setSuccess('error');
            });
    }

    const closeSidebar = (e) => {
        setToggle(
            {
                ...toggle, isCloneDrawerOpen: !toggle.isCloneDrawerOpen,
            }
        )
        clearForm()
    }

    const clearForm = (e) => {
        setFormData({
            corpus_name: '',
            gita: '',
        })
        setPullForm({
            corpus_name: '',
            folder: '',
            teamname: '',
        })

        // clear/reset step 
        setStep(1);

        // clear error messages
        setCloneFormErrors({
            git: '',
            corpus_name: ''
        })
        setPullFormErrors({
            folder: '',
            corpus_name: '',
            teamname: '',
        })
        setSingleTeam('');

        // set to default 
        setCorpusState({ ...corpusState, callTeamListApi: false })
    }

    useEffect(() => {
        if (localStorage.getItem('encryptedData')) {
            const encryptedData = localStorage.getItem('encryptedData');
            const decryptedData = AES.decrypt(encryptedData, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8)
            const parsedData = JSON.parse(decryptedData);
            const userName = parsedData?.user_data[0]?.user_name;
            setUsername(userName);
        }
    }, [localStorage.getItem('encryptedData')]);

    const fetchData = async (url, setData) => {
        try {
            let newUrl = url
            const response = await axios.get(newUrl);
            if (response.data?.data.length > 0) {
                setData(response.data?.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData(`${env.BASE_URL}:${env.PORT}/udops/team/list/`, setTeam);
        if (localStorage.getItem('encryptedData')) {
            const encryptedData = localStorage.getItem('encryptedData');
            const decryptedData = AES.decrypt(encryptedData, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8)
            const parsedData = JSON.parse(decryptedData);
            const userName = parsedData?.user_data[0]?.user_name;
            setUsername(userName);
        }
    }, []);

    useEffect(() => {
        if (corpusState.callTeamListApi) {
            fetchData(`${env.BASE_URL}:${env.PORT}/udops/team/list/`, setTeam);
        }
    }, [corpusState.callTeamListApi])

    return (
        <Drawer anchor='right' open={toggle.isCloneDrawerOpen} >
            <div className="users-sidebar-wrapper">
                <div className="users-sidebar-header">
                    <p className="users-panel-title">{step == 1 ? 'Clone' : 'Pull'}</p>
                    <div className="cross" onClick={(e) => {
                        setToggle(
                            {
                                ...toggle, isCloneDrawerOpen: !toggle.isCloneDrawerOpen,
                            }
                        )
                        clearForm()
                    }
                    }>
                        <img src={crossIcon} alt='cancel' />
                    </div>
                </div>
                <div className="users-details-wrapper">
                    {
                        step == 1 && <div className="users-flex-col">
                            <div className='one-col'>
                                <TextField
                                    name='corpus_name'
                                    onChange={handleChange}
                                    value={formData.corpus_name}
                                    autoComplete='off' size="small" fullWidth id="outlined-basic" label="Corpus Name" variant="outlined"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                                {
                                    cloneFormRrrors.corpus_name &&
                                    <div className="error-msg-cc">{cloneFormRrrors.corpus_name}</div>
                                }

                            </div>
                            <div className="one-col">
                                <TextField
                                    name='gita' className='sidebar-labels'
                                    onChange={handleChange}
                                    value={formData.gita}
                                    autoComplete='off' size="small" fullWidth id="outlined-basic" label="Github Repository" variant="outlined"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                                {
                                    cloneFormRrrors.gita &&
                                    <div className="error-msg-cc">{cloneFormRrrors.gita}</div>
                                }
                            </div>
                            <div className="column-one">
                                <FormControl size="small" fullWidth>
                                    <InputLabel id="demo-simple-select-autowidth-label">Team Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={singleTeam}
                                        onChange={handleChange}
                                        label="Team Name"
                                        name='teamname'
                                        fullWidth
                                    >
                                        {
                                            team.length &&
                                            team.map((obj, idx) => {
                                                return <MenuItem key={idx} value={obj.teamname}>{obj.teamname}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                {
                                    cloneFormRrrors.teamname &&
                                    <div className="error-msg-cc">{cloneFormRrrors.teamname}</div>
                                }
                            </div>
                        </div>
                    }
                    {
                        step == 2 &&
                        <div className="users-flex-col">
                            <div className='one-col'>
                                <TextField
                                    name='corpus_name'
                                    onChange={handleChangePull}
                                    value={pullForm.corpus_name}
                                    autoComplete='off' size="small" fullWidth id="outlined-basic" label="Corpus Name" variant="outlined"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                                {
                                    pullFormErrors.corpus_name &&
                                    <div className="error-msg-cc">{pullFormErrors.corpus_name}</div>
                                }
                            </div>
                            <div className="one-col">
                                <TextField
                                    name='folder' className='sidebar-labels'
                                    onChange={handleChangePull}
                                    value={pullForm.folder}
                                    autoComplete='off' size="small" fullWidth id="outlined-basic" label="Filename/Foldername" variant="outlined"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                                {
                                    pullFormErrors.folder &&
                                    <div className="error-msg-cc">{pullFormErrors.folder}</div>
                                }
                            </div>
                        </div>
                    }

                </div>
                <div className="panel-bottom">
                    <div className="btn-container">
                        <button onClick={
                            () => { clone(); pull(); }
                        } className="panel-edit-btn" style={{ width: '80px' }}>{step == 1 ? 'Next' : 'Pull'}</button>
                    </div>
                </div>
            </div>
        </Drawer >
    )
}