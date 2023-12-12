import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchString, setSearchString] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchString);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchString}
      onChange={(e) => setSearchString(e.target.value)}
      onKeyDown={handleSearch}
    />
  );
}

export default SearchBar;