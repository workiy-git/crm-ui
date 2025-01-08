import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config'; // Import the configuration file
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { headers } from '../atoms/Authorization';
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [menuData, setMenuData] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to control search container visibility
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/menu_bar`, { headers }) // Use apiUrl from the configuration file
      .then((response) => {
        setMenuData(response.data.data.menu_images || []);
      })
      .catch(() => {
        setMenuData([]); // Set an empty array in case of an error
      });
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchValue(''); // Reset search value when closing
    setSearchResult([]); // Reset search result when closing
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleGetData = async (filter) => {
    try {
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, '')}/appdata/retrieve?page=1&pageSize=100`,
        filter,
        { headers }
      );
      setSearchResult(response.data.data); // Set the search results
      console.log('Search Result:', response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNavigate = (row) => {
    setIsSearchOpen(false);
    const mode = 'view';
    if (row) {
      navigate(`/${row.pageName}/${mode}/${row._id}`, {
          state: { rowData: row, pageName: row.pageName, mode },
      });
  }
  };

  const handleSearchSubmit = () => {
    const filter = [
      {
        $match: {
          pageName: 'leads',
          $or: [
            { mobile_phone: searchValue },
            { alternative_phone: searchValue },
            { whatsapp: searchValue },
          ],
        },
      },
    ];
    handleGetData(filter);
  };

  const SearchContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'white',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '40ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  return (
    <div>
      <SearchContainer style={{ background: 'black', borderRadius: '100px' }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
          onClick={handleSearchClick}
        />
      </SearchContainer>

      <Dialog open={isSearchOpen} onClose={handleSearchClose} maxWidth="md" fullWidth>
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter search value"
            fullWidth
            variant="standard"
            value={searchValue}
            onChange={handleSearchInputChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
          />
          {searchResult.length > 0 ? (
  <TableContainer component={Paper} style={{ marginTop: '20px' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Mobile Phone</TableCell>
          <TableCell>Alternative Phone</TableCell>
          <TableCell>WhatsApp</TableCell>
          <TableCell>Assigned To</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {searchResult.map((row, index) => (
          <TableRow onDoubleClick={() => handleNavigate(row)} key={index}>
            <TableCell>{row.name || 'N/A'}</TableCell>
            <TableCell>{row.mobile_phone || 'N/A'}</TableCell>
            <TableCell>{row.alternative_phone || 'N/A'}</TableCell>
            <TableCell>{row.whatsapp || 'N/A'}</TableCell>
            <TableCell>{row.assigned_to || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
) : (
  <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '16px', color: 'gray' }}>
    No Data Available
  </div>
)}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchClose}>Close</Button>
          <Button onClick={handleSearchSubmit}>Search</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Search;
