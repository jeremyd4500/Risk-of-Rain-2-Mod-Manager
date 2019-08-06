import React, { Component } from 'react';
import Switch from './Switch';

import { Localize } from '../utils';

import '../styles/PopUp.css';
import '../styles/Settings.css';

const dialog = window.require('electron').remote.dialog;

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            autoUpdate: this.props.autoUpdate,
            disableMods: this.props.disableMods
        };
    }

    render() {
        return (
            <div className='PopUp'>
                <div className='PopUp__block'>
                    <div className='Settings'>
                        <div className='Settings__option'>
                            <p className='Settings__option-label'>
                                {Localize('settings.autoUpdate')}
                            </p>
                            <div className='Settings__option-action'>
                                <Switch
                                    onChange={this.autoUpdateChange}
                                    checked={this.state.autoUpdate === 'true' ? true : false}
                                />
                            </div>
                        </div>
                        <div className='Settings__option'>
                            <p className='Settings__option-label'>
                                {Localize('settings.changeGameLocation')}
                            </p>
                            <div className='Settings__option-action'>
                                <button
                                    className='Settings__option-button'
                                    onClick={() => {
                                        this.selectDirectory(this.props);
                                    }}>
                                    {Localize('buttons.change')}
                                </button>
                            </div>
                        </div>
                        <div className='Settings__option'>
                            <p className='Settings__option-label'>
                                {Localize('settings.deleteMods')}
                            </p>
                            <div className='Settings__option-action'>
                                <button className='Settings__option-button' onClick={() => {}}>
                                    {Localize('buttons.delete')}
                                </button>
                            </div>
                        </div>
                        <div className='Settings__option'>
                            <p className='Settings__option-label'>
                                {Localize('settings.disableMods')}
                            </p>
                            <div className='Settings__option-action'>
                                <Switch
                                    onChange={this.disableModsChange}
                                    checked={this.state.disableMods === 'true' ? true : false}
                                />
                            </div>
                        </div>
                        <div className='Settings__option'>
                            <p className='Settings__option-label'>{Localize('settings.export')}</p>
                            <div className='Settings__option-action'>
                                <button className='Settings__option-button' onClick={() => {}}>
                                    {Localize('buttons.export')}
                                </button>
                            </div>
                        </div>
                        <div className='Settings__option'>
                            <p className='Settings__option-label'>{Localize('settings.import')}</p>
                            <div className='Settings__option-action'>
                                <button className='Settings__option-button' onClick={() => {}}>
                                    {Localize('buttons.import')}
                                </button>
                            </div>
                        </div>
                        <div className='Settings__option'>
                            <button
                                className='Settings__option-closeButton'
                                onClick={() => {
                                    this.props.updateState({
                                        showSettings: false
                                    });
                                }}>
                                {Localize('buttons.close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    autoUpdateChange = (checked) => {
        this.updateState({ autoUpdate: checked });
        this.props.updateConfigs({
            autoUpdate: checked
        });
    };

    disableModsChange = (checked) => {
        this.updateState({ disableMods: checked });
        this.props.updateConfigs({
            disableMods: checked
        });
    };

    selectDirectory = (props) => {
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

    updateState = (params) => {
        console.log({
            action: 'UPDATE_STATE',
            component: 'Settings',
            params: { ...params }
        });
        this.setState({ ...params });
    };
}

export default Settings;
