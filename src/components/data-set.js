import '../../src/App.css';
import Navbar from './navbar';
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { SearchContext } from '../context/searchContext'
import { useContext, useState } from "react";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import DatasetFilter from './advance-dataset-filter/DatasetFilter';
import DatasetTable from './data-set/DatasetTable'

function Dataset() {
  const { searchDatasetValue, setSearchDatasetValue } = useContext(SearchContext)
  const [clear, setClear] = useState(false);
  const [inputVal, setInpuVal] = useState('');



  const handleChange = (e) => {
    if(!e.target.value){
      setSearchDatasetValue('');
    }else{
      setSearchDatasetValue(e.target.value) 
    }
    setInpuVal(e.target.value);
    if (e.target.value) {
      setClear(true);
    } else {
      setClear(false);
    }
  }

  const handleClick = (e) => {
    setSearchDatasetValue('');
    setClear(false);
    setInpuVal('');
  }


  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#02387A",
    "&:hover": {
      backgroundColor: "#02387A",
    },
  }));


  return (
    <div className="App">
      <Navbar/>
      <div className="corpus-info-header-container">
        <div className="corpus-info-heading">
          <h2 className="section-heading">Dataset Search</h2>
        </div>
        <div className="corpus-info-inputs">
          <div className="corpus-info-input-search">
            <div className="search-container">
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                onChange={handleChange}
                value={inputVal}
              />

              {/* <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
               {clear ? <ClearOutlinedIcon onClick={handleClick} />: <SearchIcon />}
              </IconButton> */}
              {clear ?
                <IconButton onClick={handleClick} type="button" sx={{ p: "10px" }} aria-label="search">
                  <ClearOutlinedIcon />
                </IconButton>
                :
                <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              }
            </div>
          </div>
          <div className="corpus-info-input-button advance-search-btn">
            <ColorButton  variant="contained">ADVANCE SEARCH</ColorButton>
            <DatasetFilter></DatasetFilter>
          </div>
        </div>
      </div>

      <div className="corpus-table-container">
        <DatasetTable />
      </div>
    </div>
  );
}

export default Dataset;
