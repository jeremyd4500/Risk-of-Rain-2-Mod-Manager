import React from 'react';

import '../styles/Log.css';

const Log = (props) => {
    return (
        <div className='Log'>
            {props.status.map((update, updateIndex) => {
                return (
                    <p className='Log__text' key={updateIndex}>
                        {update}
                    </p>
                );
            })}
        </div>
    );
};

export default Log;
