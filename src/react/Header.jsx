import React from 'react';

import '../styles/Header.css';

const Header = (props) => {
  return (
    <div className='Header'>
      <h1>{props.title}</h1>
      <div className='Header__Nav'>
        <button>Update BepInEx</button>
        <button
          onClick={() => {
            props.fetchRemoteList();
          }}>
          Refresh List
        </button>
        <button>Export</button>
        <button>Import</button>
      </div>
    </div>
  );
};

export default Header;
