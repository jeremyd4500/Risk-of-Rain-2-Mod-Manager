import React from 'react';
import { Localize } from '../utils';

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
                <button>{Localize('buttons.settings')}</button>
            </div>
        </div>
    );
};

export default Header;
