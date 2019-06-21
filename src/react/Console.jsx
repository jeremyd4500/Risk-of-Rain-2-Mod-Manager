import React from 'react';

import '../styles/Console.css';

const Console = (props) => {
  return (
    <div className='Console'>
      {props.status.map((update, index) => {
        return <p key={index}>{update}</p>;
      })}
    </div>
  );
};

export default Console;
