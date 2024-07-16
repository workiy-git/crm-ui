import React from 'react';
import Button from '@mui/material/Button';


const ShowAllButton = ({ onClick }) => {
    return (
        <Button onClick={onClick} style={{background:'#12e5e5', color:'#ffffff', fontSize:'10px', padding: 'none' }}>
         Show all
        </Button>
    );
};

export default ShowAllButton;