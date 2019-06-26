import React from 'react';
import { Localize, Filter } from '../utils';

import '../styles/Description.css';

const { shell } = window.require('electron');

const checkDeprecation = (deprecated) => {
    if (deprecated) {
        return (
            <p>
                <b>{`${Localize('warnings.note')}: `}</b>
                {Localize('warnings.deprecated')}
            </p>
        );
    }
};

const Description = (props) => {
    if (props.selectedMod) {
        return (
            <div className='Wrapper'>
                <p>{Localize('panels.description')}</p>
                <div className='Description'>
                    <button
                        onClick={() => {
                            shell.openExternal(props.selectedMod.webURL);
                        }}>
                        {Localize('actions.view')}
                    </button>
                    <button
                        onClick={async () => {
                            props.installMod({
                                name: props.selectedMod.name,
                                url: props.selectedMod.downloadURL
                            });
                        }}>
                        {Localize('actions.install')}
                    </button>
                    {checkDeprecation(props.selectedMod.deprecated)}
                    <p>
                        <b>{`${Localize('descriptions.name')}: `}</b>
                        {Filter(props.selectedMod.name)}
                    </p>
                    <p>
                        <b>{`${Localize('descriptions.author')}: `}</b>
                        {Filter(props.selectedMod.author)}
                    </p>
                    <p>
                        <b>{`${Localize('descriptions.description')}: `}</b>
                        {Filter(props.selectedMod.description)}
                    </p>
                    <p>
                        <b>{`${Localize('descriptions.latestVersion')}: `}</b>
                        {props.selectedMod.latestVersion}
                    </p>
                </div>
            </div>
        );
    } else {
        return (
            <div className='Wrapper'>
                <p>{Localize('panels.description')}</p>
                <div className='Description' />
            </div>
        );
    }
};

export default Description;
