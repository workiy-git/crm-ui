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
// import WidgetsIcon from '@mui/icons-material/WidgetsOutlined';
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
//     const validated = rows.map((data) => {
//       const validatedData = {};
//       webformSchema.forEach((field) => {
//         validatedData[field.fieldName] = data[field.fieldName] !== undefined ? data[field.fieldName] : ''; // Default value if field is missing
//       });
//       validatedData._id = data._id; // Ensure ObjectId is included for key
//       return validatedData;
//     });

//     setValidatedData(validated);

//     const columns = webformSchema.map(field => ({ fieldName: field.fieldName, label: field.label })) || [];
//     setAvailableColumns(columns);

//     // Initialize columns from localStorage
//     const storedColumns = localStorage.getItem('selectedColumns');
//     const initialColumns = storedColumns ? JSON.parse(storedColumns) : columns;
    
//     setVisibleColumns(initialColumns);
//     setTempVisibleColumns(initialColumns);
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

//   const handleEdit = () => {
//     handleMenuClose();
//     navigate(`/edit/${currentRow._id}`, { state: { rowData: currentRow, schema: webformSchema, pageName } });
//   };

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
//     setVisibleColumns(tempVisibleColumns);
//     localStorage.setItem('selectedColumns', JSON.stringify(tempVisibleColumns)); // Save selected columns
//     setShowColumnModal(false);
//   };

//   const handleSelectAll = () => {
//     setTempVisibleColumns(availableColumns);
//   };

//   const handleDeselectAll = () => {
//     setTempVisibleColumns([]);
//   };

//   const handleColumnChange = (column, isAdding) => {
//     if (isAdding) {
//       setTempVisibleColumns([...tempVisibleColumns, column]);
//     } else {
//       setTempVisibleColumns(tempVisibleColumns.filter(col => col.fieldName !== column.fieldName));
//     }
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
        
//         <Dropdown pageName={pageName} onOptionSelected={handleFilterChange} />
//         <div className="pagination-container">
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
//         <Button sx={{ color: 'black' }} onClick={() => setShowColumnModal(true)}>
//         <WidgetsIcon /> 
//         {/* <KeyboardArrowDownIcon /> */}
//         </Button>
//       </Box>

//       <Box sx={{ height: 'inherit', overflowY: 'auto', overflowX: 'hidden' }}>
//         <div className="wrapper1" ref={wrapper1Ref}>
//           <div className="div1"></div>
//         </div>
//         <TableContainer style={{ border: '1px solid #808080', height: 'max-content' }}>
//           <div className="wrapper2" ref={wrapper2Ref}>
//             <Table>
//               <TableHead className='table-head' style={{ background: '#D9D9D9', color: 'white !important' }}>
//                 <TableRow className='table-head-row'>
//                   <TableCell style={{
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     textAlign: 'center',
//                     color: 'white'
//                   }}>Actions</TableCell>
//                   {visibleColumns.map((field) => (
//                     <TableCell
//                       key={field.fieldName}
//                       style={{
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         textAlign: 'center',
//                         color: 'white'
//                       }}>{field.label}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableHead style={{ background: '#808080', color: 'white !important' }}>
//                 <TableRow className='table-head-row'>
//                   <TableCell style={{
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     textAlign: 'center',
//                     color: 'black',
//                     padding:'10px 15px'
//                   }}></TableCell>
//                   {visibleColumns.map((field) => (
//                     <TableCell key={field.fieldName} style={{ textAlign: 'center', color: 'black', padding:'10px 15px' }}>
//                       <InputBase
//                         onChange={(e) => handleSearchChange(field.fieldName, e.target.value)}
//                         inputProps={{ 'aria-label': 'search' }}
//                         className="searchBox"
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody className='table-body'>
//                 {paginatedData
//                   .filter((row) => {
//                     return Object.keys(searchTerms).every((columnName) => {
//                       const searchTerm = searchTerms[columnName];
//                       const value = row[columnName];
//                       return value.toLowerCase().includes(searchTerm);
//                     });
//                   })
//                   .map((row) => (
//                     <TableRow className='table-body-row' key={row._id}>
//                       <TableCell style={{
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         textAlign: 'center',
//                         padding: '10px',
//                         fontWeight: 'bold'
//                       }}>
//                         <IconButton onClick={(event) => handleMenuOpen(event, row)}>
//                           <MoreVertIcon />
//                         </IconButton>
//                         <Menu
//                           anchorEl={anchorEl}
//                           open={Boolean(anchorEl)}
//                           onClose={handleMenuClose}
//                         >
//                           <MenuItem onClick={handleDetails}>Details</MenuItem>
//                           <MenuItem onClick={handleEdit}>Edit</MenuItem>
//                           <MenuItem onClick={handleDelete}>Delete</MenuItem>
//                         </Menu>
//                       </TableCell>
//                       {visibleColumns.map((field) => (
//                         <TableCell
//                           key={field.fieldName}
//                           style={{
//                             whiteSpace: 'nowrap',
//                             overflow: 'hidden',
//                             textOverflow: 'ellipsis',
//                             textAlign: 'center',
//                             padding: '10px',
//                             fontWeight: 'bold'
//                           }}
//                         >
//                           {row[field.fieldName]}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </div>
//         </TableContainer>
//       </Box>

      // <Modal open={showColumnModal} onClose={closeColumnModal}>
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
      //               onChange={() => handleColumnChange(column, false)}
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
      //               onChange={() => handleColumnChange(column, true)}
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';
import config from '../../config/config';
import '../../assets/styles/callsgrid.css';
import ActionButton from '../atoms/actionbutton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Dropdown from '../atoms/dropdown';
import { useNavigate } from 'react-router-dom';

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
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const validated = rows.map((data) => {
      const validatedData = {};
      webformSchema.forEach((field) => {
        validatedData[field.fieldName] = data[field.fieldName] !== undefined ? data[field.fieldName] : ''; // Default value if field is missing
      });
      validatedData._id = data._id; // Ensure ObjectId is included for key
      return validatedData;
    });

    setValidatedData(validated);

    const columns = webformSchema.map(field => ({ fieldName: field.fieldName, label: field.label })) || [];
    setAvailableColumns(columns);
    setVisibleColumns(columns);
  }, [rows, webformSchema]);

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

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/edit/${currentRow._id}`, { state: { rowData: currentRow, schema: webformSchema, pageName } });
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
    setVisibleColumns(tempVisibleColumns);
    closeColumnModal();
  };

  const handleSelectAll = () => {
    setTempVisibleColumns(availableColumns);
  };

  const handleDeselectAll = () => {
    setTempVisibleColumns([]);
  };


  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });

    const sortedData = [...validatedData].sort((a, b) => {
      if (a[column] < b[column]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setValidatedData(sortedData);
  };

  const renderSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <KeyboardArrowDownIcon />;
    }
    if (sortConfig.direction === 'asc') {
      return <KeyboardArrowUpIcon />;
    }
    return <KeyboardArrowDownIcon />;
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

  return (
    <div className="CallsGrid">
      <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* <ActionButton /> */}
        <Button sx={{ color: 'black' }} onClick={() => setShowColumnModal(true)}>
          <WidgetsOutlinedIcon />
          {/* Columns <KeyboardArrowDownIcon /> */}
        </Button>
        <Dropdown pageName={pageName} onOptionSelected={handleFilterChange} />
        <div className="pagination-container">
          <div className='tatoal-pageination-div'>
            {/* <Text style={{ marginRight: '20px' }}><span>Showing : </span><span className='pagination-current-page'>{startIndex + 1} - {Math.min(endIndex, rows.length)}</span><span> of </span><span className='pagination-current-page'>{rows.length}</span></Text> */}
            {/* <span style={{ marginRight: '20px' }}>{`Showing ${rows.length}`}</span> */}
            {/* <span style={{ border: '1px solid #98BCFD', padding: '8px', borderRadius: '5px' }}>{`Page ${pageNumber} of ${totalPages}`}</span> */}
          </div>
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
      <TableContainer style={{  border: '1px solid #808080', height: 'max-content', }}>
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
                }}>Actions</TableCell>
                {visibleColumns.map((field) => (
                  <TableCell
                    key={field.fieldName}
                    onClick={() => handleSort(field.fieldName)}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'center',
                      color: 'white'
                    }}>{field.label}
                    {renderSortIcon(field.fieldName)}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableHead style={{ background: '#DADEFD', color: 'white !important' }}>
              <TableRow className='table-head-row'>
                <TableCell style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center',
                  color: 'black',
                  padding:'10px 15px'
                }}></TableCell>
                {visibleColumns.map((field) => (
                  <TableCell key={field.fieldName} style={{ textAlign: 'center', color: 'black', padding:'10px 15px' }}>
                    <InputBase
                      placeholder={`Search`}
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
                      <IconButton onClick={(event) => handleMenuOpen(event, row)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleDetails}>Details</MenuItem>
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
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

      <Modal open={showColumnModal} onClose={closeColumnModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Configure Columns - Calls
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box className="configure-columns" sx={{ flex: 1, marginRight: '10px' }}>
              <Typography variant="subtitle1">Selected Columns</Typography>
              {tempVisibleColumns.map((column) => (
                <Box key={column.fieldName} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setTempVisibleColumns(tempVisibleColumns.filter(col => col.fieldName !== column.fieldName));
                      }
                    }}
                  />
                  <Typography sx={{ marginLeft: '8px' }}>{column.label}</Typography>
                </Box>
              ))}
            </Box>
            <Box className="configure-columns" sx={{ flex: 1 }}>
              <Typography variant="subtitle1">Available Columns</Typography>
              {availableColumns.filter(col => !tempVisibleColumns.some(vc => vc.fieldName === col.fieldName)).map((column) => (
                <Box key={column.fieldName} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTempVisibleColumns([...tempVisibleColumns, column]);
                      }
                    }}
                  />
                  <Typography sx={{ marginLeft: '8px' }}>{column.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="contained" onClick={handleSelectAll}>Select All</Button>
            <Button variant="contained" onClick={handleDeselectAll} sx={{ marginLeft: '8px' }}>Deselect All</Button>
            <Button variant="contained" onClick={handleApplyColumns} sx={{ marginLeft: '8px' }}>Apply</Button>
            <Button variant="contained" onClick={closeColumnModal} sx={{ marginLeft: '8px' }}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Grid;