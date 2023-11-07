import '../advance-filter/filter.css'
import InputBase from '@mui/material/InputBase';
import { useState, useEffect } from 'react';
import { env } from '../../environments';
import axios from 'axios';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useFilterData } from '../../context/advanceFilterContext';


const Filter = () => {
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
    const [oneLangRequired, setOneLangRequired] = useState(false);
    const [oneSourceTypeRequired, setOneSourceTypeRequired] = useState(false);
    const [oneCopusTypeRequired, setOneCopusTypeRequired] = useState(false);
    const { data, setData } = useFilterData();


    const handleCorpus = (e) => {
        const { name, checked } = e.target;
        let tempCorpusArr = [];
        if (name == 'allSelect') {
            tempCorpusArr = corpusArr.map(corpus => { return { ...corpus, isChecked: checked } })
        } else {
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
                lang.language == name ? { ...lang, isChecked: checked } : lang
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
                d.corpus_type == name ? { ...d, isChecked: checked } : d
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
                s.source_type == name ? { ...s, isChecked: checked } : s
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

    const filterResults = (e, copyArr, originalArr, setterFunction, noDataFoundSetterFunction, type) => {
        let filtredArr = [];

        if (type === 'language') {
            for (let obj of copyArr) {
                if (obj?.language && obj.language.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) > -1) {
                    filtredArr.push(obj);
                }
            }
        } else if (type === 'sourceType') {
            for (let obj of copyArr) {
                if (obj?.source_type && obj.source_type.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) > -1) {
                    filtredArr.push(obj);
                }
            }
        } else if (type === 'corpusType') {
            for (let obj of copyArr) {
                if (obj?.corpus_type && obj.corpus_type.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) > -1) {
                    filtredArr.push(obj);
                }
            }
        }
        if (filtredArr.length > 0) {
            setterFunction(filtredArr);
            noDataFoundSetterFunction(false)
        } else if (e.target.value == '' && originalArr.length) {
            setterFunction(originalArr);
            noDataFoundSetterFunction(false)
        } else {
            noDataFoundSetterFunction(true)
        }
    }

    const hasOneField = (arr) => {
        for (let obj of arr) {
            if (obj?.isChecked) {
                return true;
            }
        }
        return false;
    }

    const getNames = (arr, type) => {
        // extracting only the first key value as api payload requires it 
        let newArr = [];
        if (type === 'lang') {
            for (let i = 0; i < arr.length; i++) {
                newArr.push(arr[i].language)
            }
        } else if (type === 'source') {
            for (let i = 0; i < arr.length; i++) {
                newArr.push(arr[i].source_type)
            }
        } else if (type === 'corpus') {
            for (let i = 0; i < arr.length; i++) {
                newArr.push(arr[i].corpus_type)
            }
        }
        return newArr;
    }

    const applyFilter = () => {
        if (hasOneField(language)) {
            setOneLangRequired(false);
        } else {
            setOneLangRequired(true);
        }
        if (hasOneField(sourceType)) {
            setOneSourceTypeRequired(false);
        } else {
            setOneSourceTypeRequired(true);
        }
        if (hasOneField(domain)) {
            setOneCopusTypeRequired(false);
        } else {
            setOneCopusTypeRequired(true);
        }
        if (hasOneField(language) && hasOneField(sourceType) && hasOneField(domain)) {
            let checkedFilteredlang = language.filter(obj => obj?.isChecked === true)
            let checkedFilteredSource = sourceType.filter(obj => obj?.isChecked === true)
            let checkedFilteredCorpus = domain.filter(obj => obj?.isChecked === true)
            let filteredlang = getNames(checkedFilteredlang, 'lang');
            let filteredSource = getNames(checkedFilteredSource, 'source');
            let filteredCorpus = getNames(checkedFilteredCorpus, 'corpus');
            setData({ ...data, language: filteredlang, source_type: filteredSource, corpus_type: filteredCorpus })
        }
    }

    const fetchData = async (url, setData, setNoDataFound, setCopyArr) => {
        try {

            let newUrl = url + '/'
            const response = await axios.get(newUrl);
            if (response.data?.data.length > 0) {
                // Remove empty items
                const filteredData = response.data.data.filter(item => item && item[`${url.split('/').pop()}`]);
                filteredData.sort((a, b) => {
                    let type = `${url.split('/').pop()}`
                    return a[type].localeCompare(b[type], undefined, { sensitivity: 'base' })
                });
                setData(filteredData);
                setCopyArr(filteredData);
                // Mark all checked
                const tempDataArr = filteredData.map(d => ({ ...d, isChecked: true }));
                setData(tempDataArr);
                // console.log(tempDataArr)
            } else {
                setNoDataFound(true);
            }
        } catch (error) {
            setNoDataFound(true);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData(`${env.BASE_URL}:${env.PORT}/udops/corpus/language`, setLanguage, setnoLanguageFound, setLanguageCopy);
        fetchData(`${env.BASE_URL}:${env.PORT}/udops/corpus/source_type`, setSourceType, setnoSourceTypeFound, setSourceTypeCopy);
        fetchData(`${env.BASE_URL}:${env.PORT}/udops/corpus/corpus_type`, setDomain, setnoCorpusTypeFound, setDomainCopy);
    }, []);

    return (
        <div className='filter'>
            <h3 className="search-heading">
                Advance search
            </h3>
            <div className="select-parent">
                {/* <div className="col">
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

                </div> */}
                {/* <div className="col">
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
                </div> */}
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
                            onChange={(e) => { filterResults(e, languageCopy, language, setLanguage, setnoLanguageFound, 'language') }}
                        />
                    </div>
                    {oneLangRequired && <p className="fieldRequired"> Atleast one language is required</p>}
                    {
                        !noLanguageFound ?
                            <div className="options-container">
                                {
                                    language.map((lang, index) => <div className='input-group' key={index}>
                                        <input checked={lang?.isChecked || false} type="checkbox" name={lang.language} id={lang.language} onChange={handleLanguage} />
                                        <label htmlFor={lang.language}>{lang.language}</label>
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
                            onChange={(e) => { filterResults(e, sourceTypeCopy, sourceType, setSourceType, setnoSourceTypeFound, 'sourceType') }}
                        />
                    </div>
                    {oneSourceTypeRequired && <p className="fieldRequired"> Atleast one source type is required</p>}
                    {
                        !noSourceTypeFound ?
                            <div className="options-container">
                                {
                                    sourceType.map((source, index) => <div className='input-group' key={index}>
                                        <input checked={source?.isChecked || false} type="checkbox" name={source.source_type} id={source.source_type} onChange={handleSourceType} />
                                        <label htmlFor={source.source_type}>{source.source_type}</label>
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
                            onChange={(e) => { filterResults(e, domainCopy, domain, setDomain, setnoCorpusTypeFound, 'corpusType') }}
                        />
                    </div>
                    {oneCopusTypeRequired && <p className="fieldRequired"> Atleast one corpus type is required</p>}
                    {
                        !noCorpusTypeFound
                            ?
                            <div className="options-container">
                                {
                                    domain.map((d, index) => <div className='input-group' key={index}>
                                        <input type="checkbox" name={d.corpus_type} id={d.corpus_type} onChange={handleDomain}
                                            checked={d?.isChecked || false}
                                        />
                                        <label htmlFor={d.corpus_type}>{d.corpus_type}</label>
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

export default Filter;
