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
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import TableSortLabel from '@mui/material/TableSortLabel';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import editIcon from "../../../src/assets/editt.png";
import deleteIcon from "../../../src/assets/deleteimg.png";
import { SearchContext } from '../../context/searchContext'
import { PanelContext } from '../../context/panelContext';
import Menu from '.././menu';
import { env } from '../../environments';


function TablePaginationActions(props) {
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
    id: 'user_name',
    numeric: false,
    disablePadding: false,
    label: 'User Name',
  },
  {
    id: 'firstname',
    numeric: false,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'lastname',
    numeric: false,
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'User Email',
    sort:false,
  }, 
];

function EnhancedTableHead(props) {
  const {  order, orderBy, onRequestSort } =
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

export default function UsersTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('user_name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { toggle, setToggle } = useContext(PanelContext)
  const [showMenu, setShowMenu] = useState(true);
  const [apiData, setApiData] = useState([]);
  const { searchUsers } = useContext(SearchContext)
  const [rows, setRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [idx, setIdx] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    axios.get(`${env.BASE_URL}:${env.PORT}/udops/user/list/`)
      .then(response => {
        setRows(response.data.data)
        if (!response.data.data) {
          setRows([]);
          setErrorMsg('No data found.')
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setErrorMsg('Something went wrong.')
        setLoading(false);
      });
  }, [toggle.callUsersListApi]);


  useEffect(() => {
    setLoading(true);
    axios.post(`${env.BASE_URL}:${env.PORT}/udops/user/list_search_user/`, { user_name_substring: searchUsers })
      .then(response => {
        setRows(response.data.data)
        if (!response.data.data || response.data.data.length === 0) {
          setRows([]);
          setErrorMsg('No data found.')
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setErrorMsg('Something went wrong.')
        setLoading(false);
      });
  }, [searchUsers]);



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
      setToggle({ ...toggle, isUserDrawerOpen: !toggle.isUserDrawerOpen, userDetailsObj: data, isEditUsers: true });
    } else {
      setToggle({ ...toggle, isUserDetailsDrawerOpen: !toggle.isUserDetailsDrawerOpen, userDetailsObj: data, isEditUsers: false });
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
                        <TableRow key={index}>
                          <TableCell scope="row" align="left" style={{ color: "#012148", padding: 12 }}>
                            <span onClick={() => openPanel(row)} className='table-cell'>
                              {row.user_name ? row.user_name : '--'}
                            </span>
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.firstname ? row.firstname : '--'}
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.lastname ? row.lastname : '--'}
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.email ? row.email : '--'}
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
