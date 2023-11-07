import '../../components/data-set/dataset-table.css'

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useContext, useEffect } from 'react'
// import { PanelContext } from '../context/panelContext';
import axios from 'axios';
import editIcon from "../../../src/assets/editt.png";
import deleteIcon from "../../../src/assets/deleteimg.png";
import { SearchContext } from '../../context/searchContext'
import { PanelContext } from '../../context/panelContext';
import Menu from '.././menu';
import { env } from '../../environments';




function TablePaginationActions(props) {
  const [localToggle, setLocalToggle] = useState(false);
  const { toggle, setToggle } = useContext(PanelContext)
  const [rerender,setRerender] = useState(0);

 
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton

        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function createData(corpus_name, customer_name, language, source_type, corpus_type) {
  return { corpus_name, customer_name, language, source_type, corpus_type };
}

 

export default function DatasetTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { toggle, setToggle } = useContext(PanelContext)
  const [showMenu, setShowMenu] = useState(true);
  const [apiData, setApiData] = useState([]);
  const { searchDatasetValue, setSearchDatasetValue } = useContext(SearchContext)
  const [rows, setRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [idx, setIdx] = useState(null); 



  useEffect(() => {

    axios.get(`${env.BASE_URL}:${env.PORT}/udops/dataset/list/`)
      .then(response => {
        setRows(response.data)
        if (response.data.length == 0) {
          setErrorMsg('No data found.')
        }
      })
      .catch(error => {
        console.log(error);
        setErrorMsg('Something went wrong.')
      });
  }, [toggle.callDatasetListApi]);

  useEffect(() => {
 
    axios.post(`${env.BASE_URL}:${env.PORT}/udops/dataset/search/`,{property:searchDatasetValue})
      .then(response => {
        setRows(response.data)
        if (response.data.length == 0) {
          setErrorMsg('No data found.')
        }
      })
      .catch(error => {
        console.log(error);
        setErrorMsg('Something went wrong.')
      });
  }, [searchDatasetValue, toggle.callDatasetListApi]);



 



  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#FFF',
      color: "#012148"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: '#012148'
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      borderRedius: '12px',
    },
  }));

  const openPanel =async (data, editFlag) => {
    if (editFlag == true) {
      setToggle({ ...toggle, datasetToggle: !toggle.datasetToggle, obj: data, isEditDataset: true });
    } else {
      setToggle({ ...toggle, datasetToggle: !toggle.datasetToggle, obj: data, isEditDataset: false });
    }
  }


  return (
    <>

      {
        rows.length > 0 ? <div className='table-container'>
          <TableContainer>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">

              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Dataset Name</StyledTableCell> 
                  <StyledTableCell>Dataset Id</StyledTableCell>
                  <StyledTableCell align="left">Corpus Type</StyledTableCell>
                  <StyledTableCell align="left">Corpus Filter</StyledTableCell>
                  <StyledTableCell align="left"></StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : rows
                ).map((row, index) => (
                  <TableRow key={row.dataset_id}>
                    <TableCell scope="row" align="left" style={{ color: "#012148", padding: 12 }}>
                      <span onClick={() => openPanel(row)} className='table-cell'>
                        {row.dataset_name ? row.dataset_name : '--'}
                      </span>
                    </TableCell>
                    <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                      {row.dataset_id ? row.dataset_id : '--'}
                    </TableCell>
                    <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                      {row.corpus_type ? row.corpus_type : '--'}
                    </TableCell>
                    <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                      {row.corpus_filter ? row.corpus_filter :'--'}
                    </TableCell>
                    <TableCell scope="row" align="left" onMouseOut={() => setIdx(rows.length + 7)} className='dots' onMouseLeave={() => setShowMenu(false)} >
                      <div className='menu-container' onMouseOver={() => setIdx(index)}>
                        <MoreVertIcon className='more-vert' onMouseOver={() => setShowMenu(true)} sx={{ color: '#02387A', fontSize: "16", cursor: "pointer" }}></MoreVertIcon>
                        <Menu index={index} idx={idx} row={row} openPanel={openPanel} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter style={{ color: "#012148", width: "100" }}>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                    colSpan={5}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div> :
          <div className="no-data-found">
            {errorMsg}
          </div>
      }


    </>

  );
}