import React from 'react';
import RemoteListCard from './RemoteListCard';
import { Localize } from '../utils';

import '../styles/RemoteList.css';

const RemoteList = (props) => {
    if (props.loaded === 'false' && props.bepInstalled === 'true') {
        props.fetchRemoteList();
        props.updateStateValue({
            key: 'loaded',
            value: 'true'
        });
    }
    return (
        <div className='Wrapper'>
            <p className='Wrapper-Title'>{Localize('panels.notInstalled')}</p>
            <div className='RemoteList'>{renderRemoteList(props)}</div>
        </div>
    );
};

const renderRemoteList = (props) => {
    const modList = [];
    /*
    Remove all other mod managers from the list since it's 
    unlikely that they are meant to be installed the same way
    as normal mods
    */
    const blackList = [
        'mythicmodmanager',
        'bepinexpack',
        'gcmanager',
        'ror2modmanager',
        'meepens_mod_loader',
        'r2modman'
    ];

    JSON.parse(props.installedMods).forEach((mod) => {
        blackList.push(mod.name.toLowerCase());
    });

    for (const mod in props.remoteList) {
        if (!blackList.includes(props.remoteList[mod].name.toLowerCase())) {
            modList.push(props.remoteList[mod]);
        }
    }
    return modList.map((mod, modIndex) => (
        <RemoteListCard
            author={mod.owner}
            deprecated={mod.is_deprecated}
            description={mod.versions[0].description}
            downloadURL={mod.versions[0].download_url}
            gameInstallLocation={props.gameInstallLocation}
            iconURL={mod.versions[0].icon}
            installMod={props.installMod}
            key={modIndex}
            latestVersion={mod.versions[0].version_number}
            name={mod.name}
            updateStateValue={props.updateStateValue}
            webURL={mod.package_url}
        />
    ));
};

export default RemoteList;
