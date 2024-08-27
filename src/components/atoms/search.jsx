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

const Search = () => {
  const [menuData, setMenuData] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to control search container visibility
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/menus/menu_bar`) // Use apiUrl from the configuration file
      .then((response) => {
        // console.log('Search Data received:', response.data.data.menu_images);
        setMenuData(response.data.data.menu_images || []);
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
        setMenuData([]); // Set an empty array in case of an error
      });
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchResult(null); // Reset search result when closing
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = () => {
    axios.get(`${config.apiUrl}/appdata`, { params: { query: searchValue } })
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch((error) => {
        console.error('Error fetching search data:', error);
        setSearchResult(null); // Reset search result in case of an error
      });
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
      // vertical padding + font size from searchIcon
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
      <SearchContainer style={{background:'black', borderRadius:'100px'}}> 
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
          onClick={handleSearchClick}
        />
      </SearchContainer>

      <Dialog open={isSearchOpen} onClose={handleSearchClose}>
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
          />
          {searchResult && (
            <div>
              <h4>Search Results:</h4>
              <pre>{JSON.stringify(searchResult, null, 2)}</pre>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchClose}>Cancel</Button>
          <Button onClick={handleSearchSubmit}>Search</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Search;