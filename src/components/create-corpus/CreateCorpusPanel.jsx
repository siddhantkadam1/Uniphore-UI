import React from 'react'
import '../create-corpus/createCorpusPanel.css'
import { Drawer } from '@mui/material'
import { PanelContext } from '../../context/panelContext'
import { useContext, useState, useEffect } from 'react'
import crossIcon from "../../../src/assets/cancel_FILL0_wght400_GRAD0_opsz48.png";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios'
import { env } from '../../environments'
import { AES, enc } from 'crypto-js';
import SharedSnacbar from '../../common-components/SharedSnackbar'
import { useSpinner } from '../../context/spinnerContext'
import { useSnackbar } from '../../context/snackbarContext'



const CreateCorpusPanel = () => {
    const { msg,setMsg, success,setSuccess, setOpen, open } = useSnackbar();
    const { setFlag } = useSpinner(); 
    const [folderFile, setFolderFile] = useState('');
    const [gitRepo, setGitRepo] = useState('');
    const [commitMsg, setCommitMsg] = useState('');
    const [steps, setSteps] = useState(1);
    const { toggle, setToggle } = useContext(PanelContext)
    const { corpusState, setCorpusState } = useContext(PanelContext)
    const [team, setTeam] = useState([]);
    const [singleTeam, setSingleTeam] = useState('');
    const [username, setUsername] = useState('');
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');
    const [corpus_name, setCorpusName] = useState('');
    const [source_type, setSourceType] = useState('');
    const [domain, setDomain] = useState('');
    const [lang_code, setLanguageCode] = useState('');
    const [language, setLanguage] = useState('');
    const [corpus_type, setCorpusType] = React.useState('');
    const [acquisition_date, setAcquisitionDate] = React.useState();
    const [migration_date, setMigrationDate] = React.useState();
    const [corpusData, setCorpusData] = useState({
        corpus_type: '',
        corpus_name: '',
        teamname: '',
        language: '',
        domain: '',
        vendor: '',
        description: '',
        source_type: '',
        lang_code: '',
        acquisition_date: '',
        migration_date: '',
    })

    const [errors, setErrors] = useState({
        corpus_name: '',
    });

    const [fileFolderErrors, setFileFolderErrors] = useState({
        folderFile: '',
    });

    const [gitRepoErrors, setGitRepoErrors] = useState({
        gitRepo: '',
    });

    const [commitErrors, setCommitErrors] = useState({
        commitMsg: '',
    });

    const validateForm = () => {
        let isValid = true;

        const newErrors = { ...errors };
        if (!corpusData.corpus_name.trim()) {
            newErrors.corpus_name = 'Corpus name is required';
            isValid = false;
        } else {
            newErrors.corpus_name = '';
        }

        if (!corpusData.corpus_type.trim()) {
            newErrors.corpus_type = 'Corpus type is required';
            isValid = false;
        } else {
            newErrors.corpus_type = '';
        }

        if (!corpusData.language.trim()) {
            newErrors.language = 'Language is required';
            isValid = false;
        } else {
            newErrors.language = '';
        }
        if (!corpusData.source_type.trim()) {
            newErrors.source_type = 'Source type is required';
            isValid = false;
        } else {
            newErrors.source_type = '';
        }
        if (!corpusData.vendor.trim()) {
            newErrors.vendor = 'Vendor is required';
            isValid = false;
        } else {
            newErrors.vendor = '';
        }
        if (!corpusData.lang_code.trim()) {
            newErrors.lang_code = 'Language code is required';
            isValid = false;
        } else {
            newErrors.lang_code = '';
        }
        if (!corpusData.teamname.trim()) {
            newErrors.teamname = 'Team name is required';
            isValid = false;
        } else {
            newErrors.teamname = '';
        }
        setErrors(newErrors);
        return isValid;
    }

    const handleChangeSteps2 = (e) => {
        let { value } = e.target;
        setFolderFile(value);
    }

    const handleChangeSteps3 = (e) => {
        let { value } = e.target;
        setGitRepo(value);
    }
    const handleChangeSteps4 = (e) => {
        let { value } = e.target;
        setCommitMsg(value);
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setCorpusData({ ...corpusData, [name]: value });
        if (name == 'corpus_type') setCorpusType(value);
        if (name == 'corpus_name') setCorpusName(value);
        if (name == 'teamname') setSingleTeam(value);
        if (name == 'language') setLanguage(value);
        if (name == 'domain') setDomain(value);
        if (name == 'vendor') setVendor(value);
        if (name == 'description') setDescription(value);
        if (name == 'source_type') setSourceType(value);
        if (name == 'lang_code') setLanguageCode(value);
    }

    const formatDates = (corpusData) => {
        corpusData.acquisition_date = acquisition_date;
        corpusData.migration_date = migration_date; 
        for (let key in corpusData) {
            if (key == 'acquisition_date') {
                if (!acquisition_date) {
                    corpusData['acquisition_date'] = '';
                } else {
                    corpusData['acquisition_date'] = dayjs(corpusData[key]).format('YYYY-MM-DD')
                }
            }
            if (key == 'migration_date') {
                if (!migration_date) {
                    corpusData['migration_date'] = '';
                } else {
                    corpusData['migration_date'] = dayjs(corpusData[key]).format('YYYY-MM-DD')
                }
            }
        } 
    }

    const trimValues = (obj) => {
        for (let key in obj) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                obj[key] = obj[key].trim();
            }
        }
    };


    const addCorpus = (e) => {
        if (steps != 1) {
            return;
        }
        if (!validateForm()) {
            return;
        }
        formatDates(corpusData);
        corpusData['username'] = username;
        delete corpusData.template;
        trimValues(corpusData);
        // setFlag function shows/hides the global spinner 
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/create_corpus/ `, corpusData)
            .then(res => {
                setOpen(true);
                // setFlag function shows/hides the global spinner 
                setFlag(false);
                if (res.data?.status && res.data.status == 'success') {
                    setSuccess('success');
                    setMsg('Corpus created successfully!')
                    setSteps(steps + 1);
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data.message)
                    setSuccess('error');
                } else {
                    setMsg('Corpus creation failed')
                    setSuccess('error');
                }
            }).catch(err => {
                setMsg('Corpus creation failed')
                setSuccess('error');
                setOpen(true);
                setFlag(false);
            })
    }

    const validateFileFolder = (e) => {
        let isValid = true;
        let newErrors = { ...fileFolderErrors };
        if (!folderFile.trim()) {
            newErrors.folderFile = 'Foldername or filename is required'
            isValid = false;
        } else {
            newErrors.folderFile = ''
        }
        setFileFolderErrors(newErrors);
        return isValid;
    }

    const addFolderFile = (e) => { 
        if (corpusState.pull) return;
        if (steps != 2) {
            return;
        }
        if (!validateFileFolder()) {
            return;
        }
        let payload = {};
        payload['target'] = folderFile;
        payload['teamname'] = corpusState.push ? corpusState.corpusObj.team_name : corpusData.teamname;
        payload['corpus_name'] = corpusState.push ? corpusState.corpusObj.corpus_name : corpusData.corpus_name;
        trimValues(payload);
        // setFlag function shows/hides the global spinner 
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/add/`, payload)
            .then(res => {
                setOpen(true);
                setFlag(false);
                if (res.data?.status && res.data.status == 'success') {
                    setSuccess('success');
                    setMsg('Added successfully!')
                    if (corpusState.skipStep) {
                        setSteps(steps + 2);
                    } else {
                        setSteps(steps + 1);
                    }
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data.message)
                    setSuccess('error');
                } else {
                    setMsg('Failed to add')
                    setSuccess('error');
                }
            }).catch(err => {
                setFlag(false);
                setOpen(true);
                setMsg('Failed to add')
                setSuccess('error');
            })
    }

    const validateGitrepo = (e) => {
        let isValid = true;
        let newErrors = { ...gitRepoErrors };
        if (!gitRepo) {
            newErrors.gitRepo = 'Github Repository is required'
            isValid = false;
        } else {
            newErrors.gitRepo = ''
        }
        setGitRepoErrors(newErrors);
        return isValid;
    }

    const addGitRepo = (e) => {
        if (steps != 3) {
            return;
        }
        if (!validateGitrepo()) {
            return;
        }
        let payload = {};
        payload['corpus_name'] = corpusData.corpus_name;
        payload['username'] = username;
        payload['gita'] = gitRepo;
        payload['teamname'] = corpusData.teamname;
        trimValues(payload);
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/remote/ `, payload)
            .then(res => {
                setOpen(true);
                setFlag(false);
                if (res.data?.status && res.data.status == 'success') {
                    setSuccess('success');
                    setMsg('Added successfully!')
                    setSteps(steps + 1);
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data.message)
                    setSuccess('error');
                } else {
                    setMsg('Failed to add')
                    setSuccess('error');
                }
            }).catch(err => {
                setOpen(true);
                setMsg('Failed to add')
                setSuccess('error');
                setFlag(false);
            })
    }

    const validateCommitMsg = (e) => {
        let isValid = true;
        let newErrors = { ...commitErrors };
        if (!commitMsg) {
            newErrors.commitMsg = 'Commit message is required'
            isValid = false;
        } else {
            newErrors.commitMsg = ''
        }
        setCommitErrors(newErrors);
        return isValid;
    }


    const commit = (e) => {
        if (steps != 4) return;
        if (!validateCommitMsg()) return;
        let payload = {};
        payload['message'] = commitMsg;
        payload['teamname'] = corpusState.push ? corpusState.corpusObj.team_name : corpusData.teamname;
        payload['corpus_name'] = corpusState.push ? corpusState.corpusObj.corpus_name : corpusData.corpus_name;

        trimValues(payload);
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/commit/ `, payload)
            .then(res => {
                setOpen(true);
                setFlag(false);
                if (res.data?.status && res.data.status == 'success') {
                    setSuccess('success');
                    setMsg('Commit Successful!')
                    push();
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data.message)
                    setSuccess('error');
                } else {
                    setMsg('Commit Failed')
                    setSuccess('error');
                }
            }).catch(err => {
                setOpen(true);
                setMsg('Commit Failed')
                setSuccess('error');
                setFlag(false);
            })
    }

    const clearForm = (e) => {
        // clear form 
        setCorpusData({
            corpus_type: '',
            corpus_name: '',
            teamname: '',
            language: '',
            domain: '',
            vendor: '',
            description: '',
            source_type: '',
            lang_code: '',
            acquisition_date: '',
            migration_date: '',
        })
        setAcquisitionDate();
        setMigrationDate();

        // clear input bound properties 
        setCorpusType('');
        setCorpusName('');
        setSingleTeam('');
        setLanguage('');
        setDomain('');
        setVendor('');
        setDescription('');
        setSourceType('');
        setLanguageCode('');

        setFolderFile('');
        setCommitMsg('');
        setGitRepo('');

        // clear error messages 
        const newErrors = { ...errors };
        for (let key in newErrors) {
            newErrors[key] = '';
        }
        setErrors(newErrors);
        setFileFolderErrors({ folderFile: '' })
        setCommitErrors({ commitMsg: '' });
        setGitRepoErrors({ gitRepo: '' });

        // set to default 
        setCorpusState({ ...corpusState, callTeamListApi: false })
        setCorpusState({ ...corpusState, callTeamListApi: false, pull: false, push: false })
    }

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
    }, [localStorage.getItem('encryptedData')]);

    useEffect(() => {
        if (corpusState.callTeamListApi) {
            fetchData(`${env.BASE_URL}:${env.PORT}/udops/team/list/`, setTeam);
        }
    }, [corpusState.callTeamListApi])


    const closeSidebar = (e) => {
        setSteps(1);
        setToggle(
            {
                ...toggle, isCreateCorpusDrawerOpen: !toggle.isCreateCorpusDrawerOpen,
            }
        );
        setCorpusState({
            ...corpusState, push: false, pull: false, skipStep: false
        });
        clearForm()
    }

    const push = (e) => {
        let payload = {};
        payload['username'] = username;
        payload['teamname'] = corpusState.push ? corpusState.corpusObj.team_name : corpusData.teamname;
        payload['corpus_name'] = corpusState.push ? corpusState.corpusObj.corpus_name : corpusData.corpus_name;
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/push/`, payload)
            .then(res => {
                setOpen(true);
                setFlag(false);
                if (res.data?.status && res.data.status == 'success') {
                    setMsg('Changes pushed successfully!')
                    setSuccess('success');
                    // close the last form 
                    closeSidebar();
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data?.message)
                    setSuccess('error');
                } else {
                    setMsg('Failed to push changes')
                    setSuccess('error');
                }
            })
            .catch(error => {
                setOpen(true);
                setMsg('Failed to push changes')
                setSuccess('error');
                setFlag(false);
            });
    }

    const pull = (e) => {
        if (!corpusState.pull) return;
        let payload = {};
        payload['username'] = username;
        payload['corpus_name'] = corpusState.corpusObj.corpus_name
        payload['folder'] = folderFile;
        payload['teamname'] = corpusState.corpusObj.team_name;
        if (!validateFileFolder()) {
            return;
        }
        trimValues(payload);
        setFlag(true);
        axios.post(`${env.BASE_URL}:${env.PORT}/udops/pull/`, payload)
            .then(res => {
                setFlag(false);
                setOpen(true);
                if (res.data?.status && res.data.status == 'success') {
                    setMsg('Changes pulled successfully!')
                    setSuccess('success');
                    // close the form 
                    closeSidebar(); 
                } else if (res.data?.status && res.data.status == 'error') {
                    setMsg(res.data?.message)
                    setSuccess('error');
                } else {
                    setMsg('Failed to pull changes')
                    setSuccess('error');
                }
            })
            .catch(error => {
                setFlag(false);
                setOpen(true);
                setMsg('Failed to pull changes')
                setSuccess('error');
            });
    }

    useEffect(() => {
        if (corpusState.push) {
            setToggle({ ...toggle, isCreateCorpusDrawerOpen: true })
            setSteps(2);
        }
        if (corpusState.pull) {
            setToggle({ ...toggle, isCreateCorpusDrawerOpen: true })
            setSteps(2);
        }
    }, [corpusState.push, corpusState.pull])


    return (
        <Drawer anchor='right' open={toggle.isCreateCorpusDrawerOpen}>
            <div className="users-sidebar-wrapper">
                <div className="users-sidebar-header">

                    {
                        steps == 1 &&
                        <p className="users-panel-title">Create Corpus  </p>

                    }
                    {
                        steps == 2 &&
                        <p className="users-panel-title">{corpusState.pull ? 'Pull files' : 'Add Files'}</p>

                    }
                    {
                        steps == 3 &&
                        <p className="users-panel-title">Remote  </p>

                    }
                    {
                        steps == 4 &&
                        <p className="users-panel-title">Commit  </p>

                    }
                    <div className="cross" onClick={(e) => {
                        setSteps(1);
                        setToggle(
                            {
                                ...toggle, isCreateCorpusDrawerOpen: !toggle.isCreateCorpusDrawerOpen,
                            }
                        );
                        setCorpusState({
                            ...corpusState, push: false, pull: false, skipStep: false
                        });
                        clearForm()
                        setOpen(false);
                    }
                    }>
                        <img src={crossIcon} alt='cancel' />
                    </div>
                </div>
                <div className="users-details-wrapper">
                    {
                        steps == 1 &&
                        <div className="users-flex-col corpus-flex-col">
                            <div className='users-two-col'>
                                <div className="column-one">
                                    <TextField
                                        name='corpus_name'
                                        onChange={handleChange}
                                        value={corpus_name}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Corpus Name" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                    {
                                        errors.corpus_name &&
                                        <div className="error-msg-cc">{errors.corpus_name}</div>
                                    }
                                </div>

                                <div className="column-two">
                                    <TextField
                                        name='corpus_type'
                                        onChange={handleChange}
                                        value={corpus_type}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Corpus Type" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                    {
                                        errors.corpus_type &&
                                        <div className="error-msg-cc">{errors.corpus_type}</div>
                                    }
                                </div>
                            </div>
                            <div className='users-two-col'>
                                <div className="column-two">
                                    <TextField
                                        name='user_name'
                                        disabled={true}
                                        value={username}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="User Name" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="column-two">
                                    <TextField
                                        name='language'
                                        onChange={handleChange}
                                        value={corpusData.language}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Language" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                    {
                                        errors.language &&
                                        <div className="error-msg-cc">{errors.language}</div>
                                    }
                                </div>
                            </div>

                            <div className='users-two-col'>
                                <div className="column-one">
                                    <TextField
                                        name='source_type'
                                        onChange={handleChange}
                                        value={source_type}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Source Type" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                    {
                                        errors.source_type &&
                                        <div className="error-msg-cc">{errors.source_type}</div>
                                    }
                                </div>
                                <div className="column-two">
                                    <TextField
                                        name='vendor'
                                        onChange={handleChange}
                                        value={vendor}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Vendor" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                    {
                                        errors.vendor &&
                                        <div className="error-msg-cc">{errors.vendor}</div>
                                    }
                                </div>
                            </div>

                            <div className="users-two-col">
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
                                        errors.teamname &&
                                        <div className="error-msg-cc">{errors.teamname}</div>
                                    }
                                </div>
                                <div className="column-two">
                                    <TextField
                                        name='lang_code'
                                        onChange={handleChange}
                                        value={lang_code}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Language Code" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                    {
                                        errors.lang_code &&
                                        <div className="error-msg-cc">{errors.lang_code}</div>
                                    }
                                </div>
                            </div>

                            <div className='users-two-col'>
                                <div className="column-one">
                                    <TextField
                                        name='domain'
                                        onChange={handleChange}
                                        value={domain}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Domain" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="column-two">
                                    <TextField
                                        name='description'
                                        onChange={handleChange}
                                        value={description}
                                        autoComplete='off' size="small" fullWidth id="outlined-basic"
                                        label="Description" variant="outlined"
                                        sx={{
                                            '& .MuiFormLabel-root': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className='users-two-col'>
                                <div className="column-one">
                                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                                        <DatePicker
                                            label="Acquisition Date"
                                            value={acquisition_date}
                                            onChange={(newValue) => {
                                                setAcquisitionDate(newValue);
                                                setCorpusData({ ...corpusData, ['acquisition_date']: newValue })
                                            }}

                                        />
                                    </DemoContainer>
                                </div>
                                <div className="column-two">
                                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                                        <DatePicker
                                            label="Migration Date"
                                            value={migration_date}
                                            onChange={(newValue) => {
                                                setMigrationDate(newValue);
                                                setCorpusData({ ...corpusData, ['migration_date']: newValue })
                                            }}
                                        />
                                    </DemoContainer>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        steps == 2 &&
                        <div className="user-flex-col">
                            <div className="column-one">
                                <TextField
                                    name='folderFile'
                                    onChange={handleChangeSteps2}
                                    value={folderFile}
                                    autoComplete='off' size="small" fullWidth id="outlined-basic"
                                    label="Foldername/Filename" variant="outlined"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                                {
                                    fileFolderErrors.folderFile &&
                                    <div className="error-msg-cc">{fileFolderErrors.folderFile}</div>
                                }
                            </div>
                        </div>
                    }
                    {
                        steps == 3 &&
                        <div className="user-flex-col">
                            <div className="column-one">
                                <TextField
                                    name='gitRepo'
                                    onChange={handleChangeSteps3}
                                    value={gitRepo}
                                    autoComplete='off' size="small" fullWidth id="outlined-basic"
                                    label="Github Repository" variant="outlined"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                                {
                                    gitRepoErrors.gitRepo &&
                                    <div className="error-msg-cc">{gitRepoErrors.gitRepo}</div>
                                }
                            </div>
                        </div>

                    }
                    {
                        steps == 4 &&
                        <div className="user-flex-col">
                            <div className="column-one">
                                <TextField
                                    name='commit'
                                    onChange={handleChangeSteps4}
                                    value={commitMsg}
                                    autoComplete='off' size="small" fullWidth id="outlined-basic"
                                    label="Commit Message" variant="outlined"
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                                {
                                    commitErrors.commitMsg &&
                                    <div className="error-msg-cc">{commitErrors.commitMsg}</div>
                                }
                            </div>
                        </div>
                    }

                </div>
                <div className="panel-bottom">
                    <div className="btn-container">
                        {
                            <button onClick={
                                () => {
                                    addCorpus();
                                    addFolderFile();
                                    addGitRepo();
                                    commit();
                                    pull();
                                }

                            } className=" btn-width panel-edit-btn">
                                {steps <= 3 ? corpusState.pull ? 'Pull' : 'Next' : 'Push'}
                            </button>
                        }
                        {
                            steps == 1 &&
                            <button onClick={
                                () => {
                                    setToggle({ ...toggle, isCreateCorpusDrawerOpen: !toggle.isCreateCorpusDrawerOpen });
                                    clearForm()
                                    setOpen(false);
                                }
                            } className=" btn-width panel-cancel-btn">
                                CANCEL
                            </button>
                        }
                    </div>

                </div>
            </div>
        </Drawer>
    )
}

export default CreateCorpusPanel













