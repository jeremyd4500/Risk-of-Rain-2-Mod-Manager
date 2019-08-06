import React from 'react';
import { Localize } from '../utils';

import '../styles/Header.css';

const app = window.require('electron').remote.app;
const fs = window.require('fs-extra');

const Header = (props) => {
    return (
        <div className='Header'>
            <h1 className='Header__header'>{Localize('title')}</h1>
            <div className='Header__Nav'>
                <button
                    className='Header__Nav-button'
                    onClick={() => {
                        installBep(props);
                    }}>
                    {Localize('buttons.updateBepInEx')}
                </button>
                <button
                    className='Header__Nav-button'
                    onClick={() => {
                        props.updateRemoteList();
                    }}>
                    {Localize('buttons.refreshList')}
                </button>
                <button
                    className='Header__Nav-button'
                    onClick={() => {
                        props.updateState({
                            showSettings: true
                        });
                    }}>
                    {Localize('buttons.settings')}
                </button>
            </div>
        </div>
    );
};

const installBep = async (props) => {
    const json = JSON.parse(await props.getRemoteList());
    let bep = null;
    for (const mod in json) {
        if (json[mod].name.toLowerCase() === 'bepinexpack') {
            bep = json[mod];
        }
    }
    if (bep) {
        const params = {
            author: bep.owner,
            deprecated: bep.is_deprecated,
            description: bep.versions[0].description,
            destination: `${app.getAppPath()}\\src\\cache\\${bep.name}`,
            downloadUrl: bep.versions[0].download_url,
            folderName: bep.name,
            iconURL: bep.versions[0].icon,
            latestVersion: bep.versions[0].version_number,
            name: bep.name,
            version: bep.versions[0].version_number,
            webURL: bep.package_url
        };

        props.updateConsoleStatus(`Downloading ${bep.name}...`);
        props.updateConsoleStatus(
            await props.downloadMod({
                ...params
            })
        );
        props.updateConsoleStatus(`Extracting ${bep.name}...`);
        props.updateConsoleStatus(
            await props.extractMod({
                ...params
            })
        );
        fs.copySync(
            `${app.getAppPath()}\\src\\cache\\${bep.name}\\${bep.name}`,
            props.gameInstallLocation
        );
        props.updateConfigs({
            bepInstalled: 'true',
            bepVersion: bep.versions[0].version_number
        });
    }
};

export default Header;
