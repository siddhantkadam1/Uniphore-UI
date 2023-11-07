
import '../data-set-panel/dataset-panel.css'
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
import { padding } from "@mui/system";
import { PanelContext } from "../../context/panelContext";
import { SearchContext } from '../../context/searchContext'
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { env } from "../../environments";


const dummyList = [
    {
        name: 'corpus 1'
    },
    {
        name: 'corpus 2'
    },
    {
        name: 'corpus 3'
    },
    {
        name: 'corpus 4'
    },
]

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

function DataSetPanel() {

    const [flip, setFlip] = useState(false);
    const [callDataset, setCallDataset] = useState(0);
    const { toggle, setToggle } = useContext(PanelContext)
    const { searchValue, setSearchValue } = useContext(SearchContext)
    const theme = useTheme();
    const [personName, setPersonName] = React.useState('');
    const [corpus, setCorpus] = React.useState('');
    const [corpusFilter, setsetCorpusFilter] = React.useState('');
    const [owner, setOwner] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [vendor, setVendor] = React.useState('');
    const [domain, setDomain] = React.useState('');
    const [summaryState, setSummaryState] = useState({});
    const [summary, setSummary] = useState([]);
    const [summaryState2, setSummaryState2] = useState({});
    const [summary2, setSummary2] = useState([]);
    const [summaryState3, setSummaryState3] = useState({});
    const [summary3, setSummary3] = useState([]);
    const [corpusList, setCorpusList] = useState([
        {
            name: 'corpus1'
        },
        {
            name: 'corpus2'
        },
        {
            name: 'corpus3'
        },
        {
            name: 'corpus4'
        },
    ]);




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
        console.log('toggle', toggle)
        setPersonName(event.target.value);
    };
    const handleChangeCorpus = (event) => {
        setCorpus(event.target.value)
    };
    const handleChangeCorpusFilter = (event) => {
        setsetCorpusFilter(event.target.value)
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


    useEffect(() => {

        setLanguage(toggle.obj.language);
        setDomain(toggle.obj.source_type);
        setOwner(toggle.obj.customer_name);
        setCorpus(toggle.obj.corpus_type);
        setsetCorpusFilter(toggle.obj.corpus_filter)
        if (toggle.isEditDataset == true) {
            setFlip(true);
        } else {
            setFlip(false);
        }

        axios.post(`${env.BASE_URL}:${env.PORT}/udops/dataset/corpus_list/`,
            {
                dataset_name: toggle.obj.dataset_name,
            }
        )
            .then(res => {
                setCorpusList(res.data);
            })
            .catch(error => {

            });
    }, [toggle.obj, toggle.isEditDataset]);



    useEffect(() => {
        const callEditApi = async () => {
            let payload = {};
            payload['dataset_name'] = toggle.obj.dataset_name;;
            payload['corpus_filter'] = corpusFilter;
            await axios.post(`${env.BASE_URL}:${env.PORT}/udops/dataset/update/`, payload)
                .then(response => {
                    setToggle({ ...toggle, callDatasetListApi: toggle.callDatasetListApi + 1 });
                })
                .catch(error => {

                });
        }
        callEditApi();

        // const callCustomeApi = async () => {
        //     let payload = [];
        //     for (let key in summaryState) {
        //         let obj = {};
        //         obj['field_name'] = key;
        //         obj['field_value'] = summaryState[key];
        //         obj['corpus_name'] = toggle.obj.corpus_name;
        //         payload.push(obj);
        //     }

        //     console.log(payload);

        //     await axios.put(`${env.BASE_URL}:${env.PORT}/update_custom_field/`, payload)
        //         .then(response => {
        //             setToggle({ ...toggle, callDatasetListApi: toggle.callDatasetListApi + 1 });
        //         })
        //         .catch(error => {

        //         });
        // }
        // callCustomeApi();

    }, [callDataset])


    useEffect(() => {
        // setSummary(dummySummary);
        // let JsonFormData = {};
        // dummySummary.map(obj => {
        //     JsonFormData[obj.key] = obj.value;
        // })
        // console.log(JsonFormData);
        // setSummaryState(JsonFormData)

        axios.post(`${env.BASE_URL}:${env.PORT}/udops/dataset/summary/`,
            {
                dataset_name: toggle.obj.dataset_name,
            }
        )
            .then(res => {
                if (res) {
                    setSummary(res.data.data.corpusSummary[0].countSummary);
                    let JsonFormData = {};
                    res.data.data.corpusSummary[0].countSummary.map(obj => {
                        JsonFormData[obj.key] = obj.value;
                    })
                    setSummaryState(JsonFormData)


                    setSummary2(res.data.data.corpusSummary[1].countSummary);
                    let JsonFormData2 = {};
                    res.data.data.corpusSummary[1].countSummary.map(obj => {
                        JsonFormData2[obj.key] = obj.value;
                    })
                    setSummaryState2(JsonFormData)


                    setSummary3(res.data.data.corpusSummary[2].countSummary);
                    let JsonFormData3 = {};
                    res.data.data.corpusSummary[2].countSummary.map(obj => {
                        JsonFormData3[obj.key] = obj.value;
                    })
                    setSummaryState3(JsonFormData3)
                }
            })
            .catch(error => {

            });
        console.log('summary dataset', toggle)

    }, [toggle.obj.dataset_name])

    return (

        <div className={`panel-main-container ${toggle.datasetToggle ? 'allowClicks' : 'blockClicks'}`}  >
            <div className={`panel-container ${toggle.datasetToggle ? 'panel-container ' : 'show'}`}>
                <div className="wrapper">
                    <div className="header">
                        <p className="panel-title">Dataset Details</p>
                        <div className="cross" onClick={(e) => setToggle({ ...toggle, datasetToggle: !toggle.datasetToggle })}>
                            <img src={crossIcon} alt='cancel' />
                        </div>
                    </div>

                    {
                        !flip ?
                            <div className="details-wrapper">
                                <div className="two-col first-row">
                                    <div>
                                        <span className="panel-lables">Dataset Name</span>
                                        <p className="lable-info">{toggle.obj.dataset_name ?? " "}</p>
                                    </div>
                                    <div>
                                        <span className="panel-lables">Dataset Type</span>
                                        <p className="lable-info">{corpus ?? " "}</p>
                                    </div>
                                </div>

                                <div className="two-col second-row">

                                    <div>
                                        <span className="panel-lables">Corpus Filter</span>
                                        <p className="lable-info corpus-filter">{corpusFilter ?? " "}</p>
                                    </div>
                                    <div>
                                        <span className="panel-lables">Last Updated</span>
                                        <p className="lable-info">
                                        
                                            {
                                              toggle.obj?.lastupdated_ts  ? <> {new Date(toggle.obj.lastupdated_ts).toLocaleDateString()}</> 
                                              :
                                              '--'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="two-col fourth-row">

                                </div>


                                <div className="description"></div>

                                <div className="access-container">
                                    <h3>Corpus with write access</h3>
                                    {
                                        corpusList.map(cor => <div key={cor.corus_name}>{cor.corpus_name}</div>)
                                    }
                                </div>
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
                                            <h5 className='sub-heading'>
                                                Language
                                            </h5>
                                            <form   >
                                                {summary.map((obj,index) => <div key={index} className="d-flex-accordion">
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

                                            <h5 className='sub-heading'>
                                                Corpush Type
                                            </h5>
                                            <form   >
                                                {summary2.map(obj => <div key={obj.key} className="d-flex-accordion">
                                                    <div className="lable-info">
                                                        {
                                                            obj.key
                                                        }
                                                    </div>
                                                    <TextField id="outlined-basic" label={obj.key} variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={true}
                                                        value={summaryState2[obj.key]}
                                                        name={obj.key}
                                                        onChange={handleSummaryChange}
                                                    />
                                                </div>)
                                                }
                                            </form>

                                            <h5 className='sub-heading'>
                                                Source Type
                                            </h5>
                                            <form   >
                                                {summary3.map(obj => <div key={obj.key} className="d-flex-accordion">
                                                    <div className="lable-info">
                                                        {
                                                            obj?.key ? obj.key : '--'
                                                        }
                                                    </div>
                                                    <TextField id="outlined-basic" label={obj.key} variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={true}
                                                        value={summaryState3[obj.key]}
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

                            </div>

                            :
                            <div className="edit-wrapper">

                                <div className="two-col-edit edit-first-row">
                                    <div className="panel-form-corpus-name">
                                        <TextField id="outlined-basic" label="Dataset Name" variant="outlined"
                                            size="small"
                                            fullWidth
                                            disabled={true}
                                            value={toggle.obj.dataset_name ?? " "}
                                        />
                                    </div>
                                    <div className="panel-form-corpus-type">
                                        <TextField
                                            label="Dataset type"
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
                                        </TextField>
                                    </div>
                                </div>
                                <div className="panel-form-corpus-name">
                                    <TextField id="outlined-basic" label="Corpus Filter" variant="outlined"
                                        size="small"
                                        fullWidth
                                        disabled={false}
                                        onChange={handleChangeCorpusFilter}
                                        value={corpusFilter ?? " "}
                                    />
                                </div>

                                <div className="two-col-edit  ">


                                    <div className="panel-form-corpus-owner width50">

                                    </div>

                                </div>
                                <div className="access-container">
                                    <h3>Corpus with write access</h3>
                                    {
                                        corpusList.map(cor => <div key={cor.corpus_name}>{cor.corpus_name}</div>)
                                    }
                                </div>
                                {/* <div className="accordion-container">
                                    <Accordion className="accordion">
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className="more-details">More Details</div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <h5 className='sub-heading'>
                                                Language
                                            </h5>
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


                                            <h5 className='sub-heading'>
                                                Corpush Type
                                            </h5>
                                            <form   >
                                                {summary2.map(obj => <div key={obj.key} className="d-flex-accordion">
                                                    <div className="lable-info">
                                                        {
                                                            obj.key
                                                        }
                                                    </div>
                                                    <TextField id="outlined-basic" label={obj.key} variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={false}
                                                        value={summaryState2[obj.key]}
                                                        name={obj.key}
                                                        onChange={handleSummaryChange}
                                                    />
                                                </div>)
                                                }
                                            </form>

                                            <h5 className='sub-heading'>
                                                Source Type
                                            </h5>
                                            <form   >
                                                {summary3.map(obj => <div key={obj.key} className="d-flex-accordion">
                                                    <div className="lable-info">
                                                        {
                                                            obj.key
                                                        }
                                                    </div>
                                                    <TextField id="outlined-basic" label={obj.key} variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={false}
                                                        value={summaryState3[obj.key]}
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
                                </div> */}

                            </div>
                    }

                    <div className="panel-bottom">
                        <div className="btn-container">
                            {flip ? <button onClick={() => { setFlip((prev) => !prev); setCallDataset(callDataset + 1); }} className="panel-edit-btn">SAVE</button>
                                :
                                <button onClick={() => { setFlip((prev) => !prev); }} className="panel-edit-btn">EDIT</button>
                            }
                            {flip ? <button onClick={() => { setFlip((prev) => !prev) }} className="panel-cancel-btn">CANCEL</button> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div >


    )
}

export default DataSetPanel;







