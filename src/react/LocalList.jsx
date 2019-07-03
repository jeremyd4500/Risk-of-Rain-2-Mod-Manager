import React from 'react';
import { Localize } from '../utils';

import LocalListCard from './LocalListCard';

import '../styles/LocalList.css';

const LocalList = (props) => {
    return (
        <div className='Wrapper'>
            <p className='Wrapper-Title'>{Localize('panels.installed')}</p>
            <div className='LocalList'>{renderInstalledMods(props)}</div>
        </div>
    );
};

const renderInstalledMods = (props) => {
    const installedMods = JSON.parse(props.installedMods);
    return installedMods.map((mod, modIndex) => (
        <LocalListCard iconURL={mod.iconURL} key={modIndex} name={mod.name} version={mod.version} />
    ));
};

export default LocalList;
