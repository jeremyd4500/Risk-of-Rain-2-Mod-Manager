import React from 'react';

import { Localize, Filter } from '../utils';

import '../styles/LocalListCard.css';

const LocalListCard = (props) => {
    return (
        <div className='LocalListCard'>
            <div className='LocalListCard__top'>
                <img className='LocalListCard__top-image' src={props.iconURL} alt={props.name} />
                <div className='LocalListCard__top-buttons'>
                    <button className='LocalListCard__top-buttons-button'>
                        {Localize('buttons.uninstall')}
                    </button>
                </div>
            </div>
            <p className='LocalListCard__title'>{Filter(props.name)}</p>
        </div>
    );
};

export default LocalListCard;
