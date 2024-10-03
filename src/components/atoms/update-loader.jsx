import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const Loader = () => {
  return (
    <Box sx={{ marginTop: '50px' }}>
      
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={8}>
        <Box display="flex" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={50} height={50} />
          <Box display="flex" flexDirection="column" gap={2}>
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: 250 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: 400 }} />
          </Box>
        </Box> 
        <Box display="flex" flexDirection="column"alignItems="center" justifyContent="center" gap={8}>
        <Box display="flex" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={50} height={50} />
          <Box display="flex" flexDirection="column" gap={2}>
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: 250 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: 400 }} />
          </Box>
        </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center"  gap={8}>
        <Box display="flex" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={50} height={50} />
          <Box display="flex" flexDirection="column" gap={1}>
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: 250 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: 400 }} />
          </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Loader;
