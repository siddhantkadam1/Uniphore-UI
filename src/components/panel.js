
import "../../src/styles/panel.css";
import crossIcon from "../../src/assets/cancel_FILL0_wght400_GRAD0_opsz48.png";
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
import { padding } from "@mui/system";
import { PanelContext } from "../context/panelContext";
import { SearchContext } from '../context/searchContext'
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Checkbox, ListItemText, Snackbar } from '@mui/material';
import { env } from "../environments";
import { useAuth } from "../context/auth";
import { AES, enc } from 'crypto-js';
import SharedSnacbar from "../common-components/SharedSnackbar";



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

function Panel() {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [success, setSuccess] = useState('');
    const [flip, setFlip] = useState(false);
    const [call, setCall] = useState(0);
    const { toggle, setToggle } = useContext(PanelContext)
    const { searchValue, setSearchValue } = useContext(SearchContext)
    const theme = useTheme();
    const [personName, setPersonName] = React.useState('');
    const [corpus, setCorpus] = React.useState('');
    const [owner, setOwner] = React.useState('');
    const [teamName, setTeamName] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [vendor, setVendor] = React.useState('');
    const [domain, setDomain] = React.useState('');
    const [summaryState, setSummaryState] = useState({});
    const [summary, setSummary] = useState([]);
    const [hours, setHours] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [userArr, setUserArr] = useState([]);
    const [userArr2, setUserArr2] = useState([]);
    const [userListWrite, setUserListWrite] = useState([])
    const [userListRead, setUserListRead] = useState([])
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedValuesRead, setSelectedValuesRead] = useState([]);
    const [failedToDeleteWrite, setFailedToDeleteWrite] = useState(false);
    const [failedToDeleteRead, setFailedToDeleteRead] = useState(false);
    const [addUsersWriteFailed, setAddUsersWriteFailed] = useState('');
    const [addUsersReadFailed, setAddUsersReadFailed] = useState(false);
    const { user, login } = useAuth();
    const [render, setRender] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState()

    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
    ];

    const corpusType = [
        'nlp',
        'asr',
    ];
    const ownerArr = [
        'TESTB',
        'dataeaze',
        'mahindra',

    ];
    let languageArr = [
        'arabic',
        'marathi',
        'hindi',
        'spanish',
        'english',
        'English',
        'Arabic',

    ];
    const vendorArr = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ];
    const domainArr = [
        'TESTA',
        'TEST',
        'TESTB',
    ];

    const handleChange = (event) => {
        setPersonName(event.target.value);
    };
    const handleChangeCorpus = (event) => {
        setCorpus(event.target.value)
    };
    const handleChangeOwner = (event) => {
        setOwner(event.target.value)
    };
    const handleChangeDomain = (event) => {
        setDomain(event.target.value)
    };
    const handleChangeLanguage = (event, l) => {
        setLanguage(event.target.value)
    };
    const handleChangeVendor = (event) => {
        setVendor(event.target.value)
    };

    const handleSummaryChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setSummaryState({ ...summaryState, [name]: value })
    }

    const setErrorMessages = (permission) => {
        if (permission == 'write') {
            setFailedToDeleteWrite(true);
        } else {
            console.log('failed to delted in')
            setFailedToDeleteRead(true);
        }
    }

    const deleteUser = (corpus, permission) => {
        if (permission === 'write') {
            setFailedToDeleteWrite(false);
        } else {
            setFailedToDeleteRead(false);
        }
        let payload = {};
        payload['user_name'] = [corpus];
        payload['corpus_name'] = toggle.obj.corpus_name
        payload['permission'] = permission;
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/remove_permission/`, payload)
            .then(res => {
                console.log(res.data?.status)

                if (permission === 'write') {

                    if (res.data?.status === 'failed') {
                        setFailedToDeleteWrite(true);
                    } else if (res['data']['status'].includes('Permission Deleted Successfully !!!')) {
                        setFailedToDeleteWrite(false);
                        getWriteList();
                    } else {
                        setFailedToDeleteWrite(true);
                    }
                } else {
                    if (res.data?.status === 'failed') {
                        setFailedToDeleteRead(true);
                    } else if (res['data']['status'].includes('Permission Deleted Successfully !!!')) {
                        setFailedToDeleteRead(false);
                        getReadList();
                    } else {
                        setFailedToDeleteRead(true);
                    }
                }

            }).catch(err => {
                console.log(err);
                if (permission == 'write') {
                    setErrorMessages('write')
                } else {
                    setErrorMessages('read')
                }
            })
    }

    const addUsersWrite = (e) => {
        setAddUsersWriteFailed('');
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/access_permission/ `,
            { user_name: selectedValues, corpus_name: toggle.obj.corpus_name, permission: 'write' })
            .then(res => {
                if (res.data?.status === 'failed') {
                    setAddUsersWriteFailed('Failed to add')
                    return;
                } else {
                    setAddUsersWriteFailed('');

                }
                getWriteList();
                // render read list also 
                getReadList();

            }).catch(err => {
                setAddUsersWriteFailed('Something went wrong')
                console.log(err);
            })
    }

    const addUsersRead = (e) => {
        setAddUsersReadFailed('');
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/access_permission/ `,
            { user_name: selectedValuesRead, corpus_name: toggle.obj.corpus_name, permission: 'read' })
            .then(res => {
                if (res.data?.status === 'failed') {
                    setAddUsersReadFailed('Failed to add')
                    return;
                } else {
                    setAddUsersReadFailed('');
                }
                getReadList();
                // render write list also 
                getWriteList();

            }).catch(err => {
                console.log(err);
                setAddUsersReadFailed('Something went wrong');
            })

    }

    const handleChangeWrite = (event) => {
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

    const getWriteList = (e) => {
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/corpus_access_list_write/`, { corpus_name: toggle.obj.corpus_name })
            .then(res => {
                if (res.data?.data.length > 0) {
                    setUserListWrite(res.data.data)
                } else {
                    setUserListWrite([])
                }
            })
            .catch(error => {

            });
    }

    const getReadList = (e) => {
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/corpus_access_list_read/`, { corpus_name: toggle.obj.corpus_name })
            .then(res => {
                if (res.data?.data.length > 0) {
                    setUserListRead(res.data.data)
                } else {
                    setUserListRead([])
                }

            })
            .catch(error => {

            });
    }

    const reset = (e) => {
        setAddUsersReadFailed('');
        setAddUsersWriteFailed('');
        setFailedToDeleteWrite(false);
        setFailedToDeleteRead(false);
        setSelectedValues([]);
        setSelectedValuesRead([]);
    }


    useEffect(() => {

        setLanguage(toggle.obj.language);
        setDomain(toggle.obj.source_type);
        setOwner(toggle.obj.customer_name);
        setCorpus(toggle.obj.corpus_type);
        if (toggle.isEdit == true) {
            setFlip(true);
        } else {
            setFlip(false);
        }
    }, [toggle.obj, toggle.isEdit]);


    const editCorpusDetails = async (e) => {
        let payload = {};
        payload['corpus_name'] = toggle.obj.corpus_name;;
        payload['source_type'] = domain;
        payload['corpus_type'] = corpus;
        payload['domain'] = domain;
        payload['language'] = language;


        await axios.put(`${env.BASE_URL}:${env.PORT}/udops/corpus/upsert/`, payload)
            .then(response => {
                setMsg('Updated successfully!')
                setToggle({ ...toggle, callListApi: toggle.callListApi + 1 });
                setOpen(true);
                setSuccess('success')
            })
            .catch(error => {
                setOpen(true);
                setMsg('Updation failed!')
                setSuccess('error')

            });
    }



    useEffect(() => {
        // const callEditApi = async () => {
        //     let payload = {};
        //     payload['corpus_name'] = toggle.obj.corpus_name;;
        //     payload['source_type'] = domain;
        //     payload['corpus_type'] = corpus;
        //     payload['domain'] = domain;
        //     payload['language'] = language;


        //     await axios.put(`${env.BASE_URL}:${env.PORT}/udops/corpus/upsert/`, payload)
        //         .then(response => {
        //             setMsg('Updated successfully!')
        //             setToggle({ ...toggle, callListApi: toggle.callListApi + 1 });
        //             setOpen(true);
        //             setSuccess('success')
        //         })
        //         .catch(error => {
        //             setOpen(true);
        //             setMsg('Updation failed!')
        //             setSuccess('error')

        //         });
        // }
        // callEditApi();

        const callCustomeApi = async () => {
            let payload = [];
            for (let key in summaryState) {
                let obj = {};
                obj['field_name'] = key;
                obj['field_value'] = summaryState[key];
                obj['corpus_name'] = toggle.obj.corpus_name;
                payload.push(obj);
            }

            console.log(payload);

            await axios.post(`${env.BASE_URL}:${env.PORT}/udops/corpus/update_custom_field/`, payload)
                .then(response => {
                    setToggle({ ...toggle, callListApi: toggle.callListApi + 1 });
                })
                .catch(error => {

                });
        }
        callCustomeApi();
    }, [call])



    useEffect(() => {
        if (!toggle.toggle) {
            axios.post(`${env.BASE_URL}:${env.PORT}/udops/corpus/summary_custom/`,
                {
                    corpus_name: toggle.obj.corpus_name
                }
            ).then(res => {
                if (res) {
                    setSummary(res.data);
                    let JsonFormData = {};
                    res.data.map(obj => {
                        JsonFormData[obj.key] = obj.value;
                    })
                    setSummaryState(JsonFormData)
                }
            })
                .catch(error => {

                });

            axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/corpus_access_list_write/`, { corpus_name: toggle.obj.corpus_name })
                .then(res => {
                    if (res.data?.data.length > 0) {
                        setUserListWrite(res.data?.data)
                    } else {

                    }

                })
                .catch(error => {

                });

            axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/corpus_access_list_read/`, { corpus_name: toggle.obj.corpus_name })
                .then(res => {
                    if (res.data?.data.length > 0) {
                        setUserListRead(res.data.data)
                    } else {

                    }
                })
                .catch(error => {

                });

            axios.get(`${env.BASE_URL}:${env.PORT}/udops/user/list/`)
                .then(res => {
                    if (!res.data.data) {
                        setAllUsers([]);
                    } else {
                        setUserArr(res.data.data)
                        setUserArr2(res.data.data)
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [toggle.obj.corpus_name, toggle.toggle])


    useEffect(() => {
        let JsonFormData = {};
        summary.map(obj => {
            JsonFormData[obj.key] = obj.value;
        })
        setSummaryState(JsonFormData)
    }, [toggle.obj.corpus_name])

    useEffect(() => {
        setLoggedInUser(JSON.parse(localStorage.getItem('userInfo')))
        // setRender(!render)
    }, [user.User_role])


    return (

        <div className={`panel-main-container ${toggle.toggle ? 'allowClicks' : 'blockClicks'}`}  >
            <div className={`panel-container ${toggle.toggle ? 'panel-container ' : 'show'}`}>
                <div className="wrapper">
                    <div className="header">
                        <p className="panel-title">Corpus details</p>
                        <div className="cross" onClick={(e) => {
                            reset();
                            setToggle({ ...toggle, toggle: !toggle.toggle })
                        }}>
                            <img src={crossIcon} alt='cancel' />
                        </div>
                    </div>

                    {
                        !flip ?
                            <div className="details-wrapper">
                                <div className="two-col first-row">
                                    <div className="min-width">
                                        <span className="panel-lables">Corpus Name</span>
                                        <p className="lable-info">{toggle.obj.corpus_name ?? "--"}</p>
                                    </div>
                                    <div className="min-width">
                                        <span className="panel-lables">Corpus Type</span>
                                        <p className="lable-info">{corpus ?? "--"}</p>
                                    </div>
                                </div>

                                <div className="two-col second-row">
                                    <div className="min-width">
                                        <span className="panel-lables">Last Updated</span>
                                        <p className="lable-info"></p>
                                        {
                                            toggle.obj?.lastupdated_ts ? <> {new Date(toggle.obj.lastupdated_ts).toLocaleDateString()}</>
                                                :
                                                '--'
                                        }
                                    </div>
                                    {/* <div className="min-width">
                                        <span className="panel-lables">Team Name</span>
                                        <p className="lable-info">{owner ?? "--"}</p>
                                    </div> */}
                                </div>
                                {/* 
                                <div className="description">
                                    <span className="panel-lables">
                                        Description
                                    </span>
                                    <p className="lable-info">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry
                                    </p>
                                </div> */}

                                <div className="two-col fourth-row">
                                    <div className="min-width">
                                        <span className="panel-lables">Language</span>
                                        <p className="lable-info">{language ?? "--"}</p>
                                    </div>
                                    {/* <div>
                                        <span className="panel-lables">Vendor</span>
                                        <p className="lable-info">Acme Corp Ltd</p>
                                    </div> */}
                                    <div className="min-width">
                                        <span className="panel-lables">Domain</span>
                                        <p className="lable-info">{domain ?? " --"}</p>
                                    </div>
                                </div>

                                {/* <div>
                                    <span className="panel-lables">Domain</span>
                                    <p className="lable-info">Retail</p>
                                </div> */}
                                <div className="description"></div>
                                <div className="accordion-container">
                                    <Accordion className="accordion">
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            className="accordion-summary"
                                        >
                                            <div className="more-details">More Details</div>
                                        </AccordionSummary>
                                        <AccordionDetails className="accordion-details">
                                            <form   >
                                                {summary.map(obj => <div key={obj.key} className="d-flex-accordion">
                                                    <div className="lable-info">
                                                        {
                                                            obj.key
                                                        }
                                                    </div>
                                                    <TextField id="outlined-basic" label={obj.key} variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={true}
                                                        value={summaryState[obj.key]}
                                                        name={obj.key}
                                                        onChange={handleSummaryChange}
                                                    />
                                                </div>)
                                                }
                                            </form>
                                            <div className={`${summary.length > 0 ? 'd-none' : 'd-block'}  `}>
                                                No data present.
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </div >
                            </div>

                            :
                            <div className="edit-wrapper">

                                <div className="two-col-edit edit-first-row">
                                    <div className="panel-form-corpus-name">
                                        <TextField id="outlined-basic" label="Corpus Name" variant="outlined"
                                            size="small"
                                            fullWidth
                                            disabled={true}
                                            value={toggle.obj.corpus_name ?? " "}
                                        />
                                    </div>
                                    <div className="panel-form-corpus-type">
                                        {/* <TextField
                                            label="Corpus type"
                                            select
                                            value={corpus ?? " "}
                                            onChange={handleChangeCorpus}
                                            fullWidth
                                            size="small"
                                        >
                                            {corpusType.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}

                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </TextField> */}
                                        <TextField id="outlined-basic" label="Corpus type" variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={corpus ?? " "}
                                            onChange={handleChangeCorpus}
                                        />
                                    </div>
                                </div>
                                {/* 
                                <div className="panel-form-corpus-owner width50">
                                    <TextField
                                        label="Owner"
                                        select
                                        value={owner ?? " "}
                                        onChange={handleChangeOwner}
                                        fullWidth
                                        size="small"
                                    >
                                        {ownerArr.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}

                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div> */}

                                {/* <div className="panel-form-description">
                                    <TextField size="small" fullWidth id="outlined-basic" label="Description" variant="outlined" />
                                </div> */}

                                <div className="two-col-edit  ">
                                    <div className="panel-form-corpus-owner width50">
                                        {/* <TextField
                                            label="Language"
                                            select
                                            value={language ?? " "}
                                            onChange={handleChangeLanguage}
                                            fullWidth
                                            size="small"
                                        >
                                            {languageArr.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}

                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </TextField> */}
                                        <TextField id="outlined-basic" label="Language" variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={language ?? " "}
                                            onChange={handleChangeLanguage}
                                        />
                                    </div>

                                    <div className="panel-form-corpus-owner width50">
                                        {/* <TextField
                                            label="Domain"
                                            select
                                            value={domain ?? " "}
                                            onChange={handleChangeDomain}
                                            fullWidth
                                            size="small"
                                        >
                                            {domainArr.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}

                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </TextField> */}
                                        <TextField id="outlined-basic" label="Domain" variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={domain ?? " "}
                                            onChange={handleChangeDomain}
                                        />
                                        {/* <TextField
                                            label="Vendor"
                                            select
                                            value={vendor}
                                            onChange={handleChangeVendor}
                                            fullWidth
                                            size="small"
                                        >
                                            {vendorArr.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}

                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </TextField> */}
                                    </div>

                                </div>

                                {/* <div className="panel-form-corpus-owner width50">
                                    <TextField
                                        label="Domain"
                                        select
                                        value={domain}
                                        onChange={handleChangeDomain}
                                        fullWidth
                                        size="small"
                                    >
                                        {domainArr.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}

                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div> */}
                                <div className="accordion-container">
                                    <Accordion className="accordion">
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className="more-details">More Details  </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <form >
                                                {summary.map(obj => <div key={obj.key} className="d-flex-accordion">
                                                    <div className="lable-info">
                                                        {
                                                            obj.key
                                                        }
                                                    </div>
                                                    <TextField id="outlined-basic" label={obj.key} variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={false}
                                                        value={summaryState[obj.key]}
                                                        name={obj.key}
                                                        onChange={handleSummaryChange}
                                                    />
                                                </div>)
                                                }
                                            </form>
                                            <div className={`${summary.length > 0 ? 'd-none' : 'd-block'}  `}>
                                                No data present.
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>

                                {
                                    localStorage.getItem('encryptedData')
                                    && JSON.parse(AES.decrypt(localStorage.getItem('encryptedData'), process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))?.User_role === 'Admin user'
                                    &&
                                    <>
                                        <div className='line'></div>
                                        <h4 className='users-sidebar-middle-heading'>Users with write access</h4>
                                        <div className="users-sidebar-select-user ">
                                            <FormControl size="small" fullWidth sx={{ m: 0, maxWidth: '29vw' }}>
                                                <InputLabel id="demo-multiple-checkbox-label">Add user</InputLabel>
                                                <Select
                                                    labelId="demo-multiple-checkbox-label"
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    value={selectedValues}
                                                    input={<OutlinedInput label="Add corpus" />}
                                                    onChange={handleChangeWrite}
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
                                                            value={obj.user_name}
                                                        >
                                                            {obj.user_name !== " " && <Checkbox checked={selectedValues.indexOf(obj.user_name) > -1} />}
                                                            {obj.user_name !== " " && <ListItemText primary={obj.user_name} />}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <div className={selectedValues.length > 0 ? 'sidebar-plus-btn' : 'pointer-none'} onClick={addUsersWrite}>ADD</div>
                                        </div>
                                        {
                                            addUsersWriteFailed.length > 0 ?
                                                <div className='no-corpus-found custome-margin color-red'>{addUsersWriteFailed}</div>
                                                :
                                                null
                                        }

                                        <div className="users-sidebar-existing-user-container">
                                            {
                                                userListWrite && userListWrite.map((cor, index) =>
                                                    <div className='users-single-user' key={index}>
                                                        <div className='mx-width'>  {cor.user_name}</div>
                                                        <div onClick={(e) => deleteUser(cor.user_name, 'write')} className="remove-user">-</div>
                                                    </div>)
                                            }
                                            {userListWrite.length === 0 ? <div className='no-corpus-found'>No users found</div> : null}
                                            {failedToDeleteWrite ? <div className='no-corpus-found text-red' >Failed to delete</div> : null}
                                        </div>

                                        <div className='line'></div>
                                        <h4 className='users-sidebar-middle-heading'>Users with read access</h4>
                                        <div className="users-sidebar-select-user ">
                                            <FormControl size="small" fullWidth sx={{ m: 0, maxWidth: '29vw' }}>
                                                <InputLabel id="demo-multiple-checkbox-label2">Add user</InputLabel>
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
                                                            value={obj.user_name}
                                                        >
                                                            {obj.user_name !== " " && <Checkbox checked={selectedValuesRead.indexOf(obj.user_name) > -1} />}
                                                            {obj.user_name !== " " && <ListItemText primary={obj.user_name} />}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <div className={selectedValuesRead.length > 0 ? 'sidebar-plus-btn' : 'pointer-none'} onClick={addUsersRead}>ADD</div>
                                        </div>
                                        {
                                            addUsersReadFailed.length > 0 ?
                                                <div className='no-corpus-found custome-margin color-red'>{addUsersReadFailed}</div>
                                                :
                                                null
                                        }
                                        <div className="users-sidebar-existing-user-container">
                                            {
                                                userListRead.length > 0 && userListRead.map((cor, index) =>
                                                    <div className='users-single-user' key={index}>
                                                        <div className='mx-width'>  {cor.user_name}</div>
                                                        <div onClick={(e) => deleteUser(cor.user_name, 'read')} className="remove-user">-</div>
                                                    </div>)
                                            }
                                            {failedToDeleteRead ? <div className='no-corpus-found text-red' >Failed to delete</div> : null}
                                            {userListRead.length === 0 ? <div lassName='no-user-found no-read-users' style={{ fontSize: 14, color: '#012148' }}>No users found</div> : null}
                                        </div>
                                    </>
                                }
                            </div>
                    }

                    <div className="panel-bottom">
                        <div className="btn-container">
                            {flip ? <button onClick={() => {
                                setFlip((prev) => !prev); setCall(call + 1);
                                editCorpusDetails();
                            }} className="panel-edit-btn">
                                SAVE
                            </button>
                                :
                                <button onClick={() => { setFlip((prev) => !prev); }} className="panel-edit-btn">EDIT</button>
                            }
                            {flip ? <button onClick={() => { setFlip((prev) => !prev) }} className="panel-cancel-btn">CANCEL</button> : null}
                        </div>
                    </div>
                </div>
            </div>
            <SharedSnacbar type={success} open={open} setOpen={setOpen} msg={msg}></SharedSnacbar>
        </div>


    )
}

export default Panel;







