import * as React from 'react';
import { ButtonGroup, Button } from '@mui/material';

export default function FilterComponent({ filterData }) {
  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button onClick={() => filterData(0)}>All</Button>
      <Button onClick={() => filterData(1)}>1 Month</Button>
      <Button onClick={() => filterData(3)}>3 Months</Button>
      <Button onClick={() => filterData(12)}>1 Year</Button>
    </ButtonGroup>
  );
}
