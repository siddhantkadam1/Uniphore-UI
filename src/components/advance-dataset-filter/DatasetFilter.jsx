import '../advance-dataset-filter/dataset-filter.css'
import InputBase from '@mui/material/InputBase';
import { useState, useEffect } from 'react';
import { env } from '../../environments';
import axios from 'axios';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



const corpusNameArr = [{ name: 'lorem1' }, { name: 'lorem2' }, { name: 'lorem3' }, { name: 'lorem4' }, { name: 'lorem5' }, { name: 'lorem6' }, , { name: 'lorem7' }, { name: 'lorem8' }, { name: 'lorem9' }, { name: 'lorem10' }, { name: 'lorem11' }];
const languageArr = [{ name: 'marathi' }, { name: 'english' }, { name: 'hindi' }, { name: 'french' }, { name: 'arabic' }, { name: 'spanish' }];
const customerArr = [{ name: 'lorem12' }, { name: 'lorem13' }, { name: 'lorem14' }, { name: 'lorem15' }, { name: 'lorem16' }, { name: 'lorem17' }];
const domainArr = [{ name: 'lorem18' }, { name: 'lorem19' }, { name: 'lorem20' }, { name: 'lorem21' }, { name: 'lorem22' }, { name: 'lorem23' }];
const sourceTypeArr = [{ name: 'lorem181' }, { name: 'lorem192' }, { name: 'lorem203' }, { name: 'loremm24' }, { name: 'loreme' }, { name: 'loremo23' }];

const DatasetFilter = () => { 
    const [corpusArr, setCorpusArr] = useState([]);
    const [corpusArrCopy, setCorpusArrCopy] = useState([]);
    const [noDataFoundMsg, setnoDataFoundMsg] = useState(false);
    const [language, setLanguage] = useState([]);
    const [languageCopy, setLanguageCopy] = useState([]);
    const [noLanguageFound, setnoLanguageFound] = useState(false);
    const [customer, setCustomer] = useState([]);
    const [customerCopy, setcustomerCopy] = useState([]);
    const [noCustomerFound, setnoCustomerFound] = useState(false);
    const [domain, setDomain] = useState([]);
    const [domainCopy, setDomainCopy] = useState([]);
    const [noCorpusTypeFound, setnoCorpusTypeFound] = useState(false);
    const [sourceType, setSourceType] = useState([]);
    const [sourceTypeCopy, setSourceTypeCopy] = useState([]);
    const [noSourceTypeFound, setnoSourceTypeFound] = useState(false); 


    const handleCorpus = (e) => {
        const { name, checked } = e.target;
        let tempCorpusArr = [];
        if (name == 'allSelect') {
            console.log(name);
            tempCorpusArr = corpusArr.map(corpus => { return { ...corpus, isChecked: checked } })
        } else {
            console.log(name);
            tempCorpusArr = corpusArr.map(corpus =>
                corpus.name == name ? { ...corpus, isChecked: checked } : corpus
            )
        }
        setCorpusArr(tempCorpusArr);
    }


    const handleLanguage = (e) => {
        const { name, checked } = e.target;
        let tempLanguageArr = [];
        if (name == 'allSelect') {
            tempLanguageArr = language.map(lang => { return { ...lang, isChecked: checked } })
        } else {
            tempLanguageArr = language.map(lang =>
                lang.name == name ? { ...lang, isChecked: checked } : lang
            )
        }
        setLanguage(tempLanguageArr);
    }

    const handleCustomer = (e) => {
        const { name, checked } = e.target;
        let tempCustomerArr = [];
        if (name == 'allSelect') {
            tempCustomerArr = customer.map(cust => { return { ...cust, isChecked: checked } })
        } else {
            tempCustomerArr = customer.map(cust =>
                cust.name == name ? { ...cust, isChecked: checked } : cust
            )
        }
        setCustomer(tempCustomerArr);
    }


    const handleDomain = (e) => {
        const { name, checked } = e.target;
        let tempDomainArr = [];
        if (name == 'allSelect') {
            tempDomainArr = domain.map(d => { return { ...d, isChecked: checked } })
        } else {
            tempDomainArr = domain.map(d =>
                d.name == name ? { ...d, isChecked: checked } : d
            )
        }
        setDomain(tempDomainArr);
    }

    const handleSourceType = (e) => {
        const { name, checked } = e.target;
        let tempSourceArr = [];
        if (name == 'allSelect') {
            tempSourceArr = sourceType.map(s => { return { ...s, isChecked: checked } })
        } else {
            tempSourceArr = sourceType.map(s =>
                s.name == name ? { ...s, isChecked: checked } : s
            )
        }
        setSourceType(tempSourceArr);
    }

    const clearAllFilters = () => {
        let deSelectedLanguages = language.map(lang => {
            return ({ ...lang, isChecked: false })
        })
        let deSelectedCorpus = corpusArr.map(corpus => {
            return ({ ...corpus, isChecked: false })
        })
        let deSelectedCustomer = customer.map(customerArr => {
            return ({ ...customerArr, isChecked: false })
        })
        let deSelectedDomain = domain.map(d => {
            return ({ ...d, isChecked: false })
        })
        let deSelectedsourceType = sourceType.map(s => {
            return ({ ...s, isChecked: false })
        })
        setLanguage(deSelectedLanguages);
        setCorpusArr(deSelectedCorpus);
        setCustomer(deSelectedCustomer);
        setDomain(deSelectedDomain);
        setSourceType(deSelectedsourceType);

    }

    const filterResults = (e, copyArr, originalArr, setterFunction, noDataFoundSetterFunction) => {
        let filtredArr = [];
        for (let obj of copyArr) {
            if (obj?.name && obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) {
                filtredArr.push(obj);
            }
        }
        if (filtredArr.length > 0) {
            setterFunction(filtredArr);
            noDataFoundSetterFunction(false)
        } else if (e.target.value == '') {
            setterFunction(originalArr);
            noDataFoundSetterFunction(false)
        } else {
            noDataFoundSetterFunction(true)
        }
    }

    const applyFilter = () => {

    }


    useEffect(() => {
        // console.log('language', language);
        // console.log('customer', customer);
        // console.log('domain', domain);
    }, [language, customer, domain])



    useEffect(() => {
        setCorpusArr(corpusNameArr);
        setCorpusArrCopy(corpusNameArr)
        setLanguage(languageArr);
        setLanguageCopy(languageArr);
        setCustomer(customerArr);
        setcustomerCopy(customerArr)
        setDomain(domainArr)
        setDomainCopy(domainArr)
        setSourceType(sourceTypeArr)
        setSourceTypeCopy(sourceTypeArr)

    }, [])

    useEffect(() => {
        axios.post(`${env.BASE_URL}:${env.PORT}/list/`, { search_string: '' })
            .then(response => {
                console.log('list res in filter comp', response);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])


    return (
        <div className='filter'>
            <h3 className="search-heading">
                Advance search
            </h3>
            <div className="select-parent">
                <div className="col">
                    <div className="flex">
                        <span>Corpus</span>
                        <div className="select-all">
                            <input type="checkbox" id="corpus" name="allSelect" onChange={handleCorpus}
                                checked={corpusArr.filter(corpus => corpus?.isChecked !== true).length < 1}
                                disabled={noDataFoundMsg}
                            />
                            <label htmlFor="corpus">Select All</label>
                        </div>
                    </div>
                    <div className="filter-input">
                        <InputBase
                            className='search-input'
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search within"
                            inputProps={{ "aria-label": "search" }}
                            onChange={(e)=>{filterResults(e, corpusArrCopy,corpusArr, setCorpusArr, setnoDataFoundMsg)}} 
                        />
                    </div>
                    {
                        !noDataFoundMsg ?
                            <div className="options-container">
                                {
                                    corpusArr.map((corpus) => <div className='input-group' key={corpus.name}>
                                        <input checked={corpus?.isChecked || false} type="checkbox" name={corpus.name} id={corpus.name} onChange={handleCorpus} />
                                        <label htmlFor={corpus.name}>{corpus.name}</label>
                                    </div>)
                                }
                            </div>
                            :
                            <div className="noData">
                                No data found.
                            </div>
                    }

                </div>
                <div className="col">
                    <div className="flex">
                        <span>Customer</span>
                        <div className="select-all">
                            <input type="checkbox" name="allSelect" id="customer"
                                onChange={handleCustomer}
                                checked={customer.filter(cust => cust?.isChecked !== true).length < 1}
                                disabled={noCustomerFound}
                            />
                            <label htmlFor="customer">Select All</label>
                        </div>
                    </div>
                    <div className="filter-input">
                        <InputBase
                            className='search-input'
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search within"
                            inputProps={{ "aria-label": "search" }}
                            onChange={(e) => {
                                filterResults(e, customerCopy, customer, setCustomer, setnoCustomerFound)
                            }}

                        />
                    </div>
                    {
                        !noCustomerFound ? 
                        <div className="options-container">
                            {
                                customer.map(cust => <div className='input-group' key={cust.name}>
                                    <input type="checkbox" name={cust.name} id={cust.name}
                                        onChange={handleCustomer}
                                        checked={cust?.isChecked || false}
                                    />
                                    <label htmlFor={cust.name}>{cust.name}</label>
                                </div>)
                            }
                        </div>
                        :
                        <div className="noData">
                            No data found
                        </div>
                    }
                </div>
                <div className="col">
                    <div className="flex">
                        <span>Language</span>
                        <div className="select-all">
                            <input type="checkbox" name="allSelect" id="language" onChange={handleLanguage}
                                checked={language.filter(lang => lang?.isChecked !== true).length < 1}
                                disabled={noLanguageFound}
                            />
                            <label htmlFor="language">Select All</label>
                        </div>
                    </div>
                    <div className="filter-input">
                        <InputBase
                            className='search-input'
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search within"
                            inputProps={{ "aria-label": "search" }}
                            onChange={(e)=>{filterResults(e, languageCopy, language, setLanguage, setnoLanguageFound)}} 
                        />
                    </div>
                   {
                    !noLanguageFound ?
                   <div className="options-container">
                        {
                            language.map((lang) => <div className='input-group' key={lang.name}>
                                <input checked={lang?.isChecked || false} type="checkbox" name={lang.name} id={lang.name} onChange={handleLanguage} />
                                <label htmlFor={lang.name}>{lang.name}</label>
                            </div>)
                        }
                    </div>
                    :
                    <div className="noData">
                        No data found
                    </div>
                    }
                </div>
                <div className="col">
                    <div className="flex">
                        <span>Source Type</span>
                        <div className="select-all">
                            <input type="checkbox" name="allSelect" id="source"
                                onChange={handleSourceType}
                                checked={sourceType.filter(s => s?.isChecked !== true).length < 1}
                                disabled={noSourceTypeFound}
                            />
                            <label htmlFor="source">Select All</label>
                        </div>
                    </div>
                    <div className="filter-input">
                        <InputBase
                            className='search-input'
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search within"
                            inputProps={{ "aria-label": "search" }}
                            onChange={(e)=>{filterResults(e, sourceTypeCopy, sourceType, setSourceType, setnoSourceTypeFound)}} 
                        />
                    </div>
                {   
                !noSourceTypeFound ? 
                <div className="options-container">
                        {
                            sourceType.map(source => <div className='input-group' key={source.name}>
                                <input checked={source?.isChecked || false} type="checkbox" name={source.name} id={source.name} onChange={handleSourceType} />
                                <label htmlFor={source.name}>{source.name}</label>
                            </div>)
                        }
                    </div>
                    :
                    <div className="noData">
                        No data found
                    </div>
                    }
                </div>
                <div className="col">
                    <div className="flex">
                        <span>Corpus Type</span>
                        <div className="select-all">
                            <input type="checkbox" name="allSelect" id="domain"
                                onChange={handleDomain}
                                checked={domain.filter(d => d?.isChecked !== true).length < 1}
                                disabled={noCorpusTypeFound}
                            />
                            <label htmlFor="domain">Select All</label>
                        </div>
                    </div>
                    <div className="filter-input">
                        <InputBase
                            className='search-input'
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search within"
                            inputProps={{ "aria-label": "search" }}
                            onChange={(e)=>{filterResults(e, domainCopy, domain, setDomain, setnoCorpusTypeFound)}} 
                        />
                    </div>
                    {
                        !noCorpusTypeFound 
                        ?
                        <div className="options-container">
                        {
                            domain.map(d => <div className='input-group' key={d.name}>
                                <input type="checkbox" name={d.name} id={d.name} onChange={handleDomain}
                                    checked={d?.isChecked || false}
                                />
                                <label htmlFor={d.name}>{d.name}</label>
                            </div>)
                        }
                     </div>
                      :
                      <div className="noData">
                        No data found
                      </div> 
                  }
                </div>
            </div>
            <div className="bottom">
                <button className="apply" onClick={applyFilter}>
                    APPLY
                </button>
                <button className="clear" onClick={clearAllFilters}>
                    CLEAR
                </button>
            </div>
        </div>
    )
}

export default DatasetFilter;
