import React from 'react';
import rp from 'request-promise';

import { Localize } from '../utils';

import '../styles/Header.css';

const app = window.require('electron').remote.app;
const fs = window.require('fs-extra');

const Header = (props) => {
    return (
        <div className='Header'>
            <h1>{Localize('title')}</h1>
            <div className='Header__Nav'>
                <button
                    onClick={() => {
                        installBep(props);
                    }}>
                    {Localize('buttons.updateBepInEx')}
                </button>
                <button
                    onClick={() => {
                        props.fetchRemoteList();
                    }}>
                    {Localize('buttons.refreshList')}
                </button>
                {/* <button>{Localize('buttons.import')}</button>
                <button>{Localize('buttons.export')}</button> */}
                <button>{Localize('buttons.settings')}</button>
            </div>
        </div>
    );
};

const getMods = () => {
    return new Promise((resolve, reject) => {
        rp('https://thunderstore.io/api/v1/package/')
            .then((html) => {
                resolve(JSON.parse(html));
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const installBep = async (props) => {
    const json = await getMods();
    let bep = null;
    for (const mod in json) {
        if (json[mod].name.toLowerCase() === 'bepinexpack') {
            bep = json[mod];
        }
    }
    if (bep) {
        props.updateConsoleStatus(`Downloading ${bep.name}...`);
        props.updateConsoleStatus(
            await props.downloadMod({
                name: bep.name,
                url: bep.versions[0].download_url
            })
        );
        props.updateConsoleStatus(`Extracting ${bep.name}...`);
        props.updateConsoleStatus(
            await props.extractMod({
                destination: `${app.getAppPath()}\\src\\cache\\${bep.name}`,
                iconURL: bep.versions[0].icon,
                name: bep.name,
                version: bep.versions[0].version_number
            })
        );
        fs.copySync(
            `${app.getAppPath()}\\src\\cache\\${bep.name}\\${bep.name}`,
            props.gameInstallLocation
        );
        props.updateMultipleConfigs({
            bepInstalled: 'true',
            bepVersion: bep.versions[0].version_number
        });
    }
};

export default Header;
