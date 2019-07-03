import React from 'react';

import { Localize, Filter } from '../utils';

import '../styles/LocalListCard.css';

const LocalListCard = (props) => {
    return (
        <div className='LocalListCard'>
            <div className='LocalListCard-Top'>
                <img src={props.iconURL} alt={props.iconURL} />
                <div className='LocalListCard-Top-Buttons'>
                    <button>{Localize('buttons.uninstall')}</button>
                </div>
            </div>
            <p>{Filter(props.name)}</p>
        </div>
    );
};

export default LocalListCard;
