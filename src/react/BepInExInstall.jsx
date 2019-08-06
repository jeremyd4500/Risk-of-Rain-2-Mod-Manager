import React from 'react';

import { Localize } from '../utils';

import '../styles/PopUp.css';
import '../styles/BepInExInstall.css';

const app = window.require('electron').remote.app;
const fs = window.require('fs-extra');

const BepInExInstall = (props) => {
    return (
        <div className='PopUp'>
            <div className='PopUp__block'>
                <p className='BepInExInstall__label'>{Localize('actions.installBepInEx')}</p>
                <button
                    className='BepInExInstall__button'
                    onClick={() => {
                        installBep(props);
                    }}>
                    {Localize('buttons.installBepInEx')}
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
        props.updateConsoleStatus(`Extracting ${bep.name}`);
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

export default BepInExInstall;
