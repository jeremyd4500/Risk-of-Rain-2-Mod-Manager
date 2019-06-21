import React from 'react';
import { Localize } from '../messages/index';

import '../styles/Header.css';

const Header = (props) => {
  return (
    <div className='Header'>
      <h1>{Localize('title')}</h1>
      <div className='Header__Nav'>
        <button>{Localize('buttons.updateBepInEx')}</button>
        <button
          onClick={() => {
            props.fetchRemoteList();
          }}>
          {Localize('buttons.refreshList')}
        </button>
        <button>{Localize('buttons.import')}</button>
        <button>{Localize('buttons.export')}</button>
      </div>
    </div>
  );
};

export default Header;
