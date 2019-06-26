import React from 'react';
import { Localize } from '../utils';

import '../styles/PopUp.css';

const dialog = window.require('electron').remote.dialog;

const GameSelect = (props) => {
    return (
        <div className='PopUp'>
            <div className='PopUp__block'>
                <p>{Localize('actions.selectInstallLocation')}</p>
                <button
                    onClick={() => {
                        selectDirectory(props.updateConfig);
                    }}>
                    {Localize('buttons.selectFolder')}
                </button>
            </div>
        </div>
    );
};

const selectDirectory = (updateConfig) => {
    dialog.showOpenDialog(
        {
            properties: ['openDirectory']
        },
        async (folderLocation) => {
            if (folderLocation) {
                const status = await updateConfig({
                    key: 'gameInstallLocation',
                    value: folderLocation[0]
                });
                if (status.startsWith('ERROR')) {
                    alert(status);
                }
            }
        }
    );
};

export default GameSelect;
