import '../common-components/chart-table.css'
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
import { useState, useContext, useEffect } from 'react' 


function TablePaginationActions(props) { 
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
 
export default function ChartTable(props) {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5); 
  const [rows, setRows] = useState([]);

//  console.log('props',props.data.datasets[0].data);
//  console.log('props',props.data.labels);

 useEffect(()=>{
    let data = props.data.datasets[0].data;
    let labels = props.data.labels 
    let combinedData = [];
    for(let i = 0; i < data.length; i++){
        let obj = {};
        obj['name'] = labels[i];
        obj['value'] = data[i];
        combinedData.push(obj);
    }
    let deepCopyData = JSON.parse(JSON.stringify(combinedData.slice(10)))
    setRows(deepCopyData);
    if(combinedData.length > 10){
    }else{
        setRows([]);
    }

 },[])

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


  return (
    <> 
          {  rows.length > 0 &&   <div className='table-container-chart'>
                <TableContainer>
                  <Table sx={{ minWidth: 100 }} aria-label="custom pagination table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">Name</StyledTableCell>
                        <StyledTableCell>Value</StyledTableCell> 
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                      ).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell scope="row" align="left" style={{ color: "#012148", padding: 12 }}>
                            <span   className='table-cell'>
                              {row.name ? row.name : '--'}
                            </span>
                          </TableCell>
                          <TableCell scope="row" align="left" style={{ color: "#012148" }}>
                            {row.value ?? '--'}
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
                          rowsPerPageOptions={[5,10, 25, { label: 'All', value: -1 }]}
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
              </div> 
          }
    </>

  );
}
