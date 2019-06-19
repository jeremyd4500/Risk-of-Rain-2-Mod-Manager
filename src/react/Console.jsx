import React from 'react';

import '../styles/Console.css';

const Console = (props) => {
  return (
    <div
      className='Console'
      onLoad={(event) => {
        console.log('loaded');
      }}
      ref={React.createRef()}>
      {props.status.map((update, key) => {
        return <p key={key}>{update}</p>;
      })}
    </div>
  );
};

export default Console;
