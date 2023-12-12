import React from 'react';
import SearchBar from '../Search/SearchBar';
import '../../stylesheets/App.css'

function Header({ onSearch ,logout, user}) {
  return (
    <div id="header" className="header">
      <div className="title">
        <div>Fake Stack Overflow</div>
      </div>
      <div id="search_bar" className='search_bar'>
        <SearchBar onSearch={onSearch} /> {/* Pass the search handler */}
      </div>
        <div>
        {user &&
        <button className='logout_button' onClick={logout}>Logout</button>
        }
        </div>
    </div>
  );
}

export default Header;