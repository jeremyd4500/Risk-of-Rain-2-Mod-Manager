import React from 'react';
import { Localize } from '../utils';

import '../styles/PopUp.css';
import '../styles/GameSelect.css';

const dialog = window.require('electron').remote.dialog;

const GameSelect = (props) => {
    return (
        <div className='PopUp'>
            <div className='PopUp__block'>
                <p className='GameSelect__label'>{Localize('actions.selectInstallLocation')}</p>
                <button
                    className='GameSelect__button'
                    onClick={() => {
                        selectDirectory(props);
                    }}>
                    {Localize('buttons.selectFolder')}
                </button>
            </div>
        </div>
    );
};

const selectDirectory = (props) => {
    dialog.showOpenDialog(
        {
            properties: ['openDirectory']
        },
        async (folderLocation) => {
            if (folderLocation) {
                const status = await props.updateConfigs({
                    gameInstallLocation: folderLocation[0]
                });
                if (status.startsWith('ERROR')) {
                    alert(status);
                }
            }
        }
    );
};

export default GameSelect;
