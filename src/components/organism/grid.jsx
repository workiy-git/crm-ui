// import React, { useState, useEffect, useRef } from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import InputBase from '@mui/material/InputBase';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, Modal, Typography, IconButton, Menu, MenuItem } from '@mui/material';
// import Text from '@mui/material/Typography';
// import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import SearchIcon from '@mui/icons-material/Search';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import axios from 'axios';
// import config from '../../config/config';
// import '../../assets/styles/callsgrid.css';
// import ActionButton from '../atoms/actionbutton';
// import Dropdown from '../atoms/dropdown';
// import { useNavigate } from 'react-router-dom';

// const Grid = ({ rows, webformSchema, onFilterChange, pageName }) => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [recordsPerPage, setRecordsPerPage] = useState(15);
//   const [validatedData, setValidatedData] = useState([]);
//   const [visibleColumns, setVisibleColumns] = useState([]);
//   const [availableColumns, setAvailableColumns] = useState([]);
//   const [showColumnModal, setShowColumnModal] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [tempVisibleColumns, setTempVisibleColumns] = useState([]);
//   const [searchTerms, setSearchTerms] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Initialize validated data
//     const validated = rows.map((data) => {
//       const validatedData = {};
//       webformSchema.forEach((field) => {
//         validatedData[field.fieldName] = data[field.fieldName] !== undefined ? data[field.fieldName] : ''; // Default value if field is missing
//       });
//       validatedData._id = data._id; // Ensure ObjectId is included for key
//       return validatedData;
//     });
  
//     setValidatedData(validated);
  
//     // Initialize columns from schema
//     const columns = webformSchema.map(field => ({ fieldName: field.fieldName, label: field.label })) || [];
    
//     // Fetch saved visible columns from local storage or set all as default
//     const savedVisibleColumns = JSON.parse(localStorage.getItem('visibleColumns')) || columns;
  
//     setAvailableColumns(columns);
//     setVisibleColumns(savedVisibleColumns);
//     setTempVisibleColumns(savedVisibleColumns);
//   }, [rows, webformSchema]);
  

//   const totalPages = Math.ceil(rows.length / recordsPerPage);
//   const startIndex = (pageNumber - 1) * recordsPerPage;
//   const endIndex = startIndex + recordsPerPage;
//   const paginatedData = validatedData.slice(startIndex, endIndex);

//   const closeColumnModal = () => {
//     setShowColumnModal(false);
//   };

//   const handleMenuOpen = (event, row) => {
//     setAnchorEl(event.currentTarget);
//     setCurrentRow(row);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setCurrentRow(null);
//   };

//   // const handleEdit = () => {
//   //   handleMenuClose();
//   //   navigate(`/edit/${currentRow._id}`, { state: { rowData: currentRow, schema: webformSchema, pageName } });
//   // };
  

//   const handleDetails = () => {
//     handleMenuClose();
//     navigate(`/details/${currentRow._id}`, { state: { rowData: currentRow, schema: webformSchema, pageName } });
//   };

//   const handleDelete = async () => {
//     handleMenuClose();
//     const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${currentRow._id}`;
//     try {
//       const response = await axios.delete(apiUrl);
//       if (response.status === 200) {
//         alert('Data deleted successfully');
//         setValidatedData(validatedData.filter(item => item._id !== currentRow._id));
//       } else {
//         alert('Error deleting data: ' + response.data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting data:', error);
//       alert('Error deleting data');
//     }
//   };

//   const handleFilterChange = (filterCondition) => {
//     onFilterChange(filterCondition);
//   };

//   const handleApplyColumns = () => {
//     // Sort tempVisibleColumns based on webformSchema order
//     const sortedVisibleColumns = tempVisibleColumns.sort((a, b) => {
//       const indexA = webformSchema.findIndex(field => field.fieldName === a.fieldName);
//       const indexB = webformSchema.findIndex(field => field.fieldName === b.fieldName);
//       return indexA - indexB;
//     });
  
//     setVisibleColumns(sortedVisibleColumns);
//     localStorage.setItem('visibleColumns', JSON.stringify(sortedVisibleColumns));
//     closeColumnModal();
//   };
  
  

//   const handleSelectAll = () => {
//     setTempVisibleColumns(availableColumns);
//   };

//   const handleDeselectAll = () => {
//     setTempVisibleColumns([]);
//   };



//   const handleSearchChange = (columnName, value) => {
//     setSearchTerms(prevSearchTerms => ({
//       ...prevSearchTerms,
//       [columnName]: value.toLowerCase() // Store lowercase for case-insensitive search
//     }));
//   };

//   const renderPageNumbers = () => {
//     const pages = [];
//     if (totalPages <= 5) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(
//           <button
//             key={i}
//             onClick={() => setPageNumber(i)}
//             className={`page-btn ${pageNumber === i ? 'active' : ''}`}
//           >
//             {i}
//           </button>
//         );
//       }
//     } else {
//       pages.push(
//         <button
//           key={1}
//           onClick={() => setPageNumber(1)}
//           className={`page-btn ${pageNumber === 1 ? 'active' : ''}`}
//         >
//           1
//         </button>
//       );

//       if (pageNumber > 3) {
//         pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
//       }

//       const startPage = Math.max(2, pageNumber - 1);
//       const endPage = Math.min(totalPages - 1, pageNumber + 1);

//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(
//           <button
//             key={i}
//             onClick={() => setPageNumber(i)}
//             className={`page-btn ${pageNumber === i ? 'active' : ''}`}
//           >
//             {i}
//           </button>
//         );
//       }

//       if (pageNumber < totalPages - 2) {
//         pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
//       }

//       pages.push(
//         <button
//           key={totalPages}
//           onClick={() => setPageNumber(totalPages)}
//           className={`page-btn ${pageNumber === totalPages ? 'active' : ''}`}
//         >
//           {totalPages}
//         </button>
//       );
//     }
//     return pages;
//   };

//   const wrapper1Ref = useRef(null);
//   const wrapper2Ref = useRef(null);

//   useEffect(() => {
//     const handleScroll = (source, target) => {
//       target.scrollLeft = source.scrollLeft;
//     };

//     const wrapper1 = wrapper1Ref.current;
//     const wrapper2 = wrapper2Ref.current;

//     const handleWrapper1Scroll = () => handleScroll(wrapper1, wrapper2);
//     const handleWrapper2Scroll = () => handleScroll(wrapper2, wrapper1);

//     wrapper1.addEventListener('scroll', handleWrapper1Scroll);
//     wrapper2.addEventListener('scroll', handleWrapper2Scroll);

//     return () => {
//       wrapper1.removeEventListener('scroll', handleWrapper1Scroll);
//       wrapper2.removeEventListener('scroll', handleWrapper2Scroll);
//     };
//   }, []);
  


//   return (
//     <div className="CallsGrid">
//       <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
//         {/* <ActionButton /> */}
//         <Button sx={{ color: 'black' }} onClick={() => setShowColumnModal(true)}>
//           <WidgetsOutlinedIcon />
//           {/* Columns <KeyboardArrowDownIcon /> */}
//         </Button>
//         <Dropdown pageName={pageName} onOptionSelected={handleFilterChange} />
//         <div className="pagination-container">
//           {/* <div className='tatoal-pageination-div'>
//             <Text style={{ marginRight: '20px' }}><span>Showing : </span><span className='pagination-current-page'>{startIndex + 1} - {Math.min(endIndex, rows.length)}</span><span> of </span><span className='pagination-current-page'>{rows.length}</span></Text>
//             <span style={{ marginRight: '20px' }}>{`Showing ${rows.length}`}</span>
//             <span style={{ border: '1px solid #98BCFD', padding: '8px', borderRadius: '5px' }}>{`Page ${pageNumber} of ${totalPages}`}</span>
//           </div> */}
//           <Box className="pagination-box">
//             <button
//               onClick={() => setPageNumber(pageNumber - 1)}
//               disabled={pageNumber === 1}
//               className="page-btn-arrow"
//             >
//               &lt;&lt; Previous
//             </button>
//             {renderPageNumbers()}
//             <button
//               onClick={() => setPageNumber(pageNumber + 1)}
//               disabled={pageNumber === totalPages}
//               className="page-btn-arrow"
//             >
//               Next &gt;&gt;
//             </button>
//           </Box>
//         </div>
//       </Box>

//       <Box sx={{ height: 'inherit', overflowY: 'auto', overflowX: 'hidden' }}>
//       <div className="wrapper1" ref={wrapper1Ref}>
//         <div className="div1"></div>
//       </div>
//       <TableContainer style={{  border: '1px solid #808080', height: 'max-content', }}>
//         <div className="wrapper2" ref={wrapper2Ref}>
//           <Table>{/* style={{transform: 'rotate(180deg)'}} */}
//             <TableHead className='table-head' style={{ background: '#D9D9D9', color: 'white !important' }}>
//               <TableRow className='table-head-row'>
//                 <TableCell style={{
//                   whiteSpace: 'nowrap',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                   textAlign: 'center',
//                   color: 'white'
//                 }}>Actions</TableCell>
//                 {visibleColumns.map((field) => (
//                   <TableCell
//                     key={field.fieldName}
//                     style={{
//                       whiteSpace: 'nowrap',
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                       textAlign: 'center',
//                       color: 'white'
//                     }}>{field.label}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>

//             <TableHead style={{ background: '#808080', color: 'white !important' }}>
//               <TableRow className='table-head-row'>
//                 <TableCell style={{
//                   whiteSpace: 'nowrap',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                   textAlign: 'center',
//                   color: 'black',
//                   padding:'10px 15px'
//                 }}><Text></Text></TableCell>
//                 {visibleColumns.map((field) => (
//                   <TableCell key={field.fieldName} style={{ textAlign: 'center', color: 'black', padding:'10px 15px' }}>
//                     <InputBase
//                       onChange={(e) => handleSearchChange(field.fieldName, e.target.value)}
//                       inputProps={{ 'aria-label': 'search' }}
//                       className="searchBox"
//                     />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>

//             <TableBody className='table-body'>
//               {paginatedData
//                 .filter((row) => {
//                   return Object.keys(searchTerms).every((columnName) => {
//                     const searchTerm = searchTerms[columnName];
//                     const value = row[columnName];
//                     return value.toLowerCase().includes(searchTerm);
//                   });
//                 })
//                 .map((row) => (
//                   <TableRow className='table-body-row' key={row._id}>
//                     <TableCell style={{
//                       whiteSpace: 'nowrap',
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                       textAlign: 'center',
//                       padding: '10px',
//                       fontWeight: 'bold'
//                     }}>
//                       <IconButton onClick={(event) => handleMenuOpen(event, row)}>
//                         <MoreVertIcon />
//                       </IconButton>
//                       <Menu
//                         anchorEl={anchorEl}
//                         open={Boolean(anchorEl)}
//                         onClose={handleMenuClose}
//                       >
//                         <MenuItem onClick={handleDetails}>Details</MenuItem>
//                         {/* <MenuItem onClick={handleEdit}>Edit</MenuItem> */}
//                         <MenuItem onClick={handleDelete}>Delete</MenuItem>
//                       </Menu>
//                     </TableCell>
//                     {visibleColumns.map((field) => (
//                       <TableCell
//                         key={field.fieldName}
//                         style={{
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           textAlign: 'center',
//                           padding: '10px',
//                           fontWeight: 'bold'
//                         }}
//                       >
//                         {row[field.fieldName]}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </div>
//       </TableContainer>
//     </Box>

//       {/* Modals */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
//         <Box
//           component="form"
//           sx={{
//             margin: '50px auto',
//             padding: '20px',
//             backgroundColor: 'white',
//             maxWidth: '500px',
//           }}
//         >
//           <Button type="submit" variant="contained" color="primary">
//             Save
//           </Button>
//         </Box>
//       </Modal>

//       <Modal open={showColumnModal} onClose={closeColumnModal}>
//   <Box
//     sx={{
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       bgcolor: 'background.paper',
//       border: '2px solid #000',
//       boxShadow: 24,
//       p: 4,
//     }}
//   >
//     <Typography variant="h6" gutterBottom>
//       Configure Columns - Calls
//     </Typography>
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Box className="configure-columns" sx={{ flex: 1, marginRight: '10px' }}>
//         <Typography variant="subtitle1">Selected Columns</Typography>
//         {tempVisibleColumns.map((column) => (
//           <Box key={column.fieldName} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
//             <input
//               type="checkbox"
//               checked={true}
//               onChange={(e) => {
//                 if (!e.target.checked) {
//                   setTempVisibleColumns(tempVisibleColumns.filter(col => col.fieldName !== column.fieldName));
//                 }
//               }}
//             />
//             <Typography sx={{ marginLeft: '8px' }}>{column.label}</Typography>
//           </Box>
//         ))}
//       </Box>
//       <Box className="configure-columns" sx={{ flex: 1 }}>
//         <Typography variant="subtitle1">Available Columns</Typography>
//         {availableColumns.filter(col => !tempVisibleColumns.some(vc => vc.fieldName === col.fieldName)).map((column) => (
//           <Box key={column.fieldName} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
//             <input
//               type="checkbox"
//               checked={false}
//               onChange={(e) => {
//                 if (e.target.checked) {
//                   setTempVisibleColumns([...tempVisibleColumns, column]);
//                 }
//               }}
//             />
//             <Typography sx={{ marginLeft: '8px' }}>{column.label}</Typography>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
//       <Button variant="contained" onClick={handleSelectAll}>Select All</Button>
//       <Button variant="contained" onClick={handleDeselectAll} sx={{ marginLeft: '8px' }}>Deselect All</Button>
//       <Button variant="contained" onClick={handleApplyColumns} sx={{ marginLeft: '8px' }}>Apply</Button>
//       <Button variant="contained" onClick={closeColumnModal} sx={{ marginLeft: '8px' }}>Close</Button>
//     </Box>
//   </Box>
// </Modal>

//     </div>
//   );
// };

// export default Grid;

import React, { useState, useEffect, useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, Modal, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import Text from '@mui/material/Typography';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';
import config from '../../config/config';
import '../../assets/styles/callsgrid.css';
import ActionButton from '../atoms/actionbutton';
import Dropdown from '../atoms/dropdown';
import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx'; // Import xlsx for Excel file generation

const Grid = ({ rows, webformSchema, onFilterChange, pageName }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [validatedData, setValidatedData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [tempVisibleColumns, setTempVisibleColumns] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set()); // New state for selected rows
  const navigate = useNavigate();

  const localStorageKey = `visibleColumns_${pageName}`; // Unique key for each tab

  useEffect(() => {
    // Initialize validated data
    const validated = rows.map((data) => {
      const validatedData = {};
      webformSchema.forEach((field) => {
        validatedData[field.fieldName] = data[field.fieldName] !== undefined ? data[field.fieldName] : ''; // Default value if field is missing
      });
      validatedData._id = data._id; // Ensure ObjectId is included for key
      return validatedData;
    });

    setValidatedData(validated);

    // Initialize columns from schema
    const columns = webformSchema.map(field => ({ fieldName: field.fieldName, label: field.label })) || [];
    
    // Fetch saved visible columns from local storage or set all as default
    const savedVisibleColumns = JSON.parse(localStorage.getItem(localStorageKey)) || columns;

    setAvailableColumns(columns);
    setVisibleColumns(savedVisibleColumns);
    setTempVisibleColumns(savedVisibleColumns);
  }, [rows, webformSchema, localStorageKey]); // Include localStorageKey dependency

  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const startIndex = (pageNumber - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = validatedData.slice(startIndex, endIndex);

  const closeColumnModal = () => {
    setShowColumnModal(false);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleDetails = () => {
    handleMenuClose();
    navigate(`/details/${currentRow._id}`, { state: { rowData: currentRow, schema: webformSchema, pageName } });
  };

  const handleDelete = async () => {
    handleMenuClose();
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${currentRow._id}`;
    try {
      const response = await axios.delete(apiUrl);
      if (response.status === 200) {
        alert('Data deleted successfully');
        setValidatedData(validatedData.filter(item => item._id !== currentRow._id));
      } else {
        alert('Error deleting data: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Error deleting data');
    }
  };

  const handleFilterChange = (filterCondition) => {
    onFilterChange(filterCondition);
  };

  const handleApplyColumns = () => {
    // Sort tempVisibleColumns based on webformSchema order
    const sortedVisibleColumns = tempVisibleColumns.sort((a, b) => {
      const indexA = webformSchema.findIndex(field => field.fieldName === a.fieldName);
      const indexB = webformSchema.findIndex(field => field.fieldName === b.fieldName);
      return indexA - indexB;
    });
  
    setVisibleColumns(sortedVisibleColumns);
    localStorage.setItem(localStorageKey, JSON.stringify(sortedVisibleColumns));
    closeColumnModal();
  };

  const handleSelectAll = () => {
    setTempVisibleColumns(availableColumns);
  };

  const handleDeselectAll = () => {
    setTempVisibleColumns([]);
  };

  const handleSearchChange = (columnName, value) => {
    setSearchTerms(prevSearchTerms => ({
      ...prevSearchTerms,
      [columnName]: value.toLowerCase() // Store lowercase for case-insensitive search
    }));
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPageNumber(i)}
            className={`page-btn ${pageNumber === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          onClick={() => setPageNumber(1)}
          className={`page-btn ${pageNumber === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );

      if (pageNumber > 3) {
        pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
      }

      const startPage = Math.max(2, pageNumber - 1);
      const endPage = Math.min(totalPages - 1, pageNumber + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPageNumber(i)}
            className={`page-btn ${pageNumber === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }

      if (pageNumber < totalPages - 2) {
        pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => setPageNumber(totalPages)}
          className={`page-btn ${pageNumber === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  const wrapper1Ref = useRef(null);
  const wrapper2Ref = useRef(null);

  useEffect(() => {
    const handleScroll = (source, target) => {
      target.scrollLeft = source.scrollLeft;
    };

    const wrapper1 = wrapper1Ref.current;
    const wrapper2 = wrapper2Ref.current;

    const handleWrapper1Scroll = () => handleScroll(wrapper1, wrapper2);
    const handleWrapper2Scroll = () => handleScroll(wrapper2, wrapper1);

    wrapper1.addEventListener('scroll', handleWrapper1Scroll);
    wrapper2.addEventListener('scroll', handleWrapper2Scroll);

    return () => {
      wrapper1.removeEventListener('scroll', handleWrapper1Scroll);
      wrapper2.removeEventListener('scroll', handleWrapper2Scroll);
    };
  }, []);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  const sortData = (columnName) => {
    let newSortDirection = 'asc';
    if (sortColumn === columnName && sortDirection === 'asc') {
      newSortDirection = 'desc';
    }
    
    const sortedData = [...validatedData].sort((a, b) => {
      if (a[columnName] < b[columnName]) return newSortDirection === 'asc' ? -1 : 1;
      if (a[columnName] > b[columnName]) return newSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
    setSortColumn(columnName);
    setSortDirection(newSortDirection);
    setValidatedData(sortedData);
  };

  const handleSelectRow = (row) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(row._id)) {
        newSelectedRows.delete(row._id);
      } else {
        newSelectedRows.add(row._id);
      }
      return newSelectedRows;
    });
  };

  const handleDownloadExcel = () => {
    const selectedData = validatedData.filter(row => selectedRows.has(row._id));
    if (selectedData.length === 0) {
      alert('No rows selected');
      return;
    }

    // Create a new workbook and add the data
    // const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.json_to_sheet(selectedData);
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // // Generate the Excel file and trigger download
    // XLSX.writeFile(wb, 'selected_data.xlsx');
  };

  return (
    <div className="CallsGrid">
      <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button sx={{ color: 'black' }} onClick={() => setShowColumnModal(true)}>
          <WidgetsOutlinedIcon />
        </Button>
        <Dropdown pageName={pageName} onOptionSelected={handleFilterChange} />
        <div className="pagination-container">
          <Box className="pagination-box">
            <button
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="page-btn-arrow"
            >
              &lt;&lt; Previous
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber === totalPages}
              className="page-btn-arrow"
            >
              Next &gt;&gt;
            </button>
          </Box>
        </div>
      </Box>

      <Box sx={{ height: 'inherit', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="wrapper1" ref={wrapper1Ref}>
          <div className="div1"></div>
        </div>
        <TableContainer style={{ border: '1px solid #808080', height: 'max-content' }}>
          <div className="wrapper2" ref={wrapper2Ref}>
            <Table>
              <TableHead className='table-head' style={{ background: '#D9D9D9', color: 'white !important' }}>
                <TableRow className='table-head-row'>
                 
                  <TableCell style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <Button sx={{ color: 'white' }} onClick={handleDownloadExcel}>
                      Actions
                    </Button></TableCell>
                  {visibleColumns.map((field) => (
                    <TableCell
                      key={field.fieldName}
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'center',
                        color: 'white'
                      }}
                      onClick={() => sortData(field.fieldName)}
                    >
                      {field.label}
                      {sortColumn === field.fieldName && (
                        sortDirection === 'asc' ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableHead style={{ background: '#808080', color: 'white !important' }}>
                <TableRow className='table-head-row'>
                <TableCell style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <input
                      type="checkbox"
                      onChange={() => {
                        const allSelected = paginatedData.every(row => selectedRows.has(row._id));
                        if (allSelected) {
                          setSelectedRows(new Set()); // Deselect all if already all selected
                        } else {
                          setSelectedRows(new Set(paginatedData.map(row => row._id))); // Select all in the page
                        }
                      }}
                      checked={paginatedData.every(row => selectedRows.has(row._id))}
                    />
                  </TableCell>
                  {visibleColumns.map((field) => (
                    <TableCell key={field.fieldName} style={{ textAlign: 'center', color: 'black', padding: '10px 15px' }}>
                      <InputBase
                        onChange={(e) => handleSearchChange(field.fieldName, e.target.value)}
                        inputProps={{ 'aria-label': 'search' }}
                        className="searchBox"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className='table-body'>
                {paginatedData
                  .filter((row) => {
                    return Object.keys(searchTerms).every((columnName) => {
                      const searchTerm = searchTerms[columnName];
                      const value = row[columnName];
                      return value.toLowerCase().includes(searchTerm);
                    });
                  })
                  .map((row) => (
                    <TableRow className='table-body-row' key={row._id}>
                      <TableCell style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'center',
                        padding: '10px',
                        fontWeight: 'bold'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(row._id)}
                          onChange={() => handleSelectRow(row)}
                        />
                        <IconButton onClick={(event) => handleMenuOpen(event, row)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleDetails}>Details</MenuItem>
                          <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                      {visibleColumns.map((field) => (
                        <TableCell
                          key={field.fieldName}
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center',
                            padding: '10px',
                            fontWeight: 'bold'
                          }}
                        >
                          {row[field.fieldName]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TableContainer>
      </Box>

      {/* Modals */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          component="form"
          sx={{
            margin: '50px auto',
            padding: '20px',
            backgroundColor: 'white',
            maxWidth: '500px',
          }}
        >
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Modal>

      <Modal open={showColumnModal} onClose={closeColumnModal} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={{ ...modalStyle, width: 500 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Choose Columns
          </Typography>
          <Box id="modal-description" sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '45%', height: '300px', overflow: 'auto' }}>
              <Typography variant="subtitle1">Selected Columns</Typography>
              <div className="column-options">
                {tempVisibleColumns.map((column) => (
                  <div key={column.fieldName}>
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {
                        setTempVisibleColumns(tempVisibleColumns.filter(col => col.fieldName !== column.fieldName));
                      }}
                    />
                    <span>{column.label}</span>
                  </div>
                ))}
              </div>
            </Box>
            <Box sx={{ width: '45%', height: '300px', overflow: 'auto' }}>
              <Typography variant="subtitle1">Available Columns</Typography>
              <div className="column-options">
                {availableColumns
                  .filter(column => !tempVisibleColumns.some(col => col.fieldName === column.fieldName))
                  .map((column) => (
                    <div key={column.fieldName}>
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => {
                          setTempVisibleColumns([...tempVisibleColumns, column]);
                        }}
                      />
                      <span>{column.label}</span>
                    </div>
                  ))}
              </div>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handleSelectAll}>Select All</Button>
            <Button onClick={handleDeselectAll}>Deselect All</Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={closeColumnModal}>Cancel</Button>
            <Button onClick={handleApplyColumns}>Apply</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Grid;

