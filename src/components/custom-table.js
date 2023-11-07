import '../../src/styles/custom-table.css'

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
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useContext, useEffect } from 'react'
// import { PanelContext } from '../context/panelContext';
import axios from 'axios';
import editIcon from "../../src/assets/editt.png";
import deleteIcon from "../../src/assets/deleteimg.png";
import { SearchContext } from '../context/searchContext'
import { PanelContext } from '../context/panelContext';
import Menu from './menu';
import { env } from '../environments';
import { useFilterData } from '../context/advanceFilterContext';




function TablePaginationActions(props) {
  const [localToggle, setLocalToggle] = useState(false);
  const { toggle, setToggle } = useContext(PanelContext)
  const [rerender, setRerender] = useState(0);


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

// sorting functionality below 
function descendingComparator(a, b, orderBy) {
   // Check if a[orderBy] and b[orderBy] are not null
   if (a[orderBy] !== null && b[orderBy] !== null) {
    const aValue = a[orderBy].toLowerCase();
    const bValue = b[orderBy].toLowerCase();
    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
  } else if (a[orderBy] !== null) {
    // Handle the case where b[orderBy] is null
    return -1;
  } else if (b[orderBy] !== null) {
    // Handle the case where a[orderBy] is null
    return 1;
  }
  // Handle the case where both a[orderBy] and b[orderBy] are null
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'corpus_name',
    numeric: false,
    disablePadding: false,
    label: 'Corpus Name',
  },
  {
    id: 'team_name',
    numeric: false,
    disablePadding: false,
    label: 'Team Name',
  },
  {
    id: 'language',
    numeric: false,
    disablePadding: false,
    label: 'Language',
  },
  {
    id: 'source_type',
    numeric: false,
    disablePadding: false,
    label: 'Source Type',
  },
  {
    id: 'corpus_type',
    numeric: false,
    disablePadding: false,
    label: 'Corpus Type',
  },
 
];
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};
// sorting functionality above 

export default function CustomPaginationActionsTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('corpus_name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showMenu, setShowMenu] = useState(true);
  const [apiData, setApiData] = useState([]);
  const { toggle, setToggle } = useContext(PanelContext)
  const { searchValue, setSearchValue } = useContext(SearchContext)
  const [rows, setRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [idx, setIdx] = useState(null);
  const [languageArr, setLanguageArr] = useState([])
  const [sourceType, setSourceType] = useState([])
  const [corpusArr, setCorpusArr] = useState([])
  const { data, setData } = useFilterData();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    axios.post(`${env.BASE_URL}:${env.PORT}/udops/corpus/search/`, { corpus_name: searchValue })
      .then(response => {
        setLoading(false);
        if (response.data.data == null || response.data.data.length == 0) {
          setErrorMsg('No data found.')
          setRows([])
        } else {
          setRows(response.data.data)
        }
      })
      .catch(error => {
        console.log(error);
        setErrorMsg('Something went wrong.')
        setLoading(false);

      });
  }, [searchValue, toggle.callListApi]);

  const fetchCorpusList = () => {
    if (data.language.length == 0 || data.source_type.length == 0 || data.corpus_type.length == 0) return;
    setLoading(true);
    axios.post(`${env.BASE_URL}:${env.PORT}/udops/corpus/list/`, data)
      .then(response => {
        setLoading(false);
        if (response.data.data == null) {
          setErrorMsg('No data found.')
          return;
        }
        if (typeof response.data.data === 'string' && response.data.data.toLowerCase().includes('data not found')) {
          setErrorMsg('No data found.')
          setRows([])
          return;
        }
        if (response.data.data == null || response.data.data.length == 0) {
          setErrorMsg('No data found.')
        } else {
          setRows(response.data.data)
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);

        setErrorMsg('Something went wrong.')
      });
  }

  useEffect(() => {
    fetchCorpusList();
    console.log('filter data', data);
  }, [data.language, data.source_type, data.corpus_type])


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

  const openPanel = (data, editFlag) => {
    if (editFlag == true) {
      setToggle({ ...toggle, toggle: !toggle.toggle, obj: data, isEdit: true });
    } else {
      setToggle({ ...toggle, toggle: !toggle.toggle, obj: data, isEdit: false });
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      {
        loading ?
          <div className='loading'>loading...</div>
          :
          <div>

            {
              rows.length > 0 ? <div className='table-container'>
                <TableContainer>
                  <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {(rowsPerPage > 0
                        ? stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                      ).map((row, index) => (
                        <TableRow key={row.corpus_id}>
                          <TableCell scope="row" align="left" style={{ color: "#012148", padding: 12 }}>
                            <span onClick={() => openPanel(row)} className='table-cell'>
                              {row.corpus_name ? row.corpus_name : '--'}
                            </span>
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.team_name ? row.team_name : '--'}
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.language ? row.language : '--'}
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.source_type ? row.source_type : '--'}
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.corpus_type ? row.corpus_type : '--'}
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
                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
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
          </div>

      }
    </>

  );
}