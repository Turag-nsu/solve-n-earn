import * as React from 'react';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { Box } from '@mui/material';
import { InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBoxWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: 'auto',
  marginTop: '2rem',
  maxWidth: '90%',
  backgroundColor: alpha(theme.palette.secondary.main, 0.6),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.8),
  },
  '&:focus-within': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
    boxShadow: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.5)}`,
  },
}));

const SearchIconWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.secondary.main, 0.6),
    borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.text.primary,
  '& input': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    padding: theme.spacing(1),
  },
}));


function AnimatedSearchBox({ onSearch }) {
  const [searchValue, setSearchValue] = React.useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value); // Invoke the callback function with the updated search value
  }

  return (
    <SearchBoxWrapper>
      <SearchIconWrapper>
        <Search />
      </SearchIconWrapper>
      <SearchInput 
        placeholder="Search..." 
        value={searchValue} 
        onChange={handleInputChange} 
      />
    </SearchBoxWrapper>
  );
}

export default AnimatedSearchBox;
