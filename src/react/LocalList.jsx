import React from 'react';
import { Localize } from '../utils';

import '../styles/LocalList.css';

const LocalList = (props) => {
  return (
    <div className='Wrapper'>
      <p>{Localize('panels.installed')}</p>
      <div className='LocalList' />
    </div>
  );
};

export default LocalList;
