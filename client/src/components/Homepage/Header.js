import React from 'react';
import SearchBar from '../Search/SearchBar';

function Header({ onSearch }) {
  return (
    <div id="header" className="header">
      <div className="title">
        <div>Fake Stack Overflow</div>
      </div>
      <div id="search_bar" className='search_bar'>
        <SearchBar onSearch={onSearch} /> {/* Pass the search handler */}
      </div>
    </div>
  );
}

export default Header;