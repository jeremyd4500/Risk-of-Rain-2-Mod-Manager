import React, { Component } from 'react';
import VersionSelect from './VersionSelect';
import { Localize, Filter } from '../utils';

import '../styles/Description.css';

const { shell } = window.require('electron');

class Description extends Component {
    constructor(props) {
        super(props);

        this.state = {
            downloadURL: null,
            version: null
        };
    }

    componentDidUpdate() {
        const { downloadURL, version } = this.state;
        if (this.props.selectedMod && !downloadURL && !version) {
            this.updateState({
                downloadURL: this.props.selectedMod.downloadURL,
                version: this.props.selectedMod.latestVersion
            });
        }
    }

    render() {
        const { gameInstallLocation, installMod, selectedMod } = this.props;

        if (selectedMod) {
            return (
                <div className='Wrapper'>
                    <p className='Wrapper__title'>{Localize('panels.description')}</p>
                    <div className='Description'>
                        <div className='Description__buttons'>
                            <button
                                className='Description__buttons-button'
                                onClick={() => {
                                    shell.openExternal(selectedMod.webURL);
                                }}>
                                {Localize('actions.view')}
                            </button>
                            <button
                                className='Description__buttons-button'
                                onClick={async () => {
                                    const folderName = `ror2mm___${selectedMod.name}___${
                                        this.state.version
                                    }`;
                                    installMod({
                                        author: selectedMod.author,
                                        deprecated: selectedMod.deprecated,
                                        description: selectedMod.description,
                                        destination: `${gameInstallLocation}\\BepInEx\\plugins\\${folderName}`,
                                        downloadURL: this.state.downloadURL,
                                        folderName: folderName,
                                        iconURL: selectedMod.iconURL,
                                        latestVersion: selectedMod.latestVersion,
                                        name: selectedMod.name,
                                        version: this.state.version,
                                        webURL: selectedMod.webURL
                                    });
                                }}>
                                {Localize('actions.install')}
                            </button>
                        </div>
                        {this.checkDeprecation(selectedMod.deprecated)}
                        <p className='Description__label'>
                            <b>{`${Localize('descriptions.name')}: `}</b>
                            {Filter(selectedMod.name)}
                        </p>
                        <p className='Description__label'>
                            <b>{`${Localize('descriptions.author')}: `}</b>
                            {Filter(selectedMod.author)}
                        </p>
                        <p className='Description__label'>
                            <b>{`${Localize('descriptions.description')}: `}</b>
                            {Filter(selectedMod.description)}
                        </p>
                        <p className='Description__label'>
                            <b>{`${Localize('descriptions.availableVersions')}: `}</b>
                            {this.renderVersions()}
                        </p>
                        <p className='Description__label'>
                            <b>{`${Localize('descriptions.latestVersion')}: `}</b>
                            {selectedMod.latestVersion}
                        </p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='Wrapper'>
                    <p className='Wrapper__title'>{Localize('panels.description')}</p>
                    <div className='Description' />
                </div>
            );
        }
    }

    checkDeprecation = (deprecated) => {
        if (deprecated) {
            return (
                <p className='Description__label'>
                    <b>{`${Localize('warnings.note')}: `}</b>
                    {Localize('warnings.deprecated')}
                </p>
            );
        }
    };

    renderVersions = () => {
        const versions = {};

        this.props.selectedMod.versions.forEach((element) => {
            versions[element.version_number] = element.download_url;
        });

        return (
            <VersionSelect
                onChange={(event) => {
                    const version = event.target.value;
                    this.updateState({
                        downloadURL: versions[version],
                        version: version
                    });
                }}
                selected={
                    this.state.version ? this.state.version : this.props.selectedMod.latestVersion
                }
                versions={Object.keys(versions)}
            />
        );
    };

    updateState = (params) => {
        console.log({
            action: 'UPDATE_STATE',
            component: 'Description',
            params: { ...params }
        });
        this.setState({ ...params });
    };
}

export default Description;
