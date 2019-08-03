import React from 'react';
import { Localize, Filter } from '../utils';

import '../styles/RemoteListCard.css';

const RemoteListCard = (props) => {
    return (
        <div className='RemoteListCard'>
            <div className='RemoteListCard__top'>
                <img
                    className='RRemoteListCard__top-image'
                    src={props.iconURL}
                    alt={props.iconURL}
                />
                <div className='RemoteListCard__top-buttons'>
                    <button
                        className='RemoteListCard__top-buttons-button'
                        onClick={async () => {
                            props.installMod({
                                destination: `${props.gameInstallLocation}\\BepInEx\\plugins\\${
                                    props.name
                                }`,
                                iconURL: props.iconURL,
                                name: props.name,
                                url: props.downloadURL,
                                version: props.latestVersion
                            });
                        }}>
                        {Localize('buttons.install')}
                    </button>
                    <button
                        className='RemoteListCard__top-buttons-button'
                        onClick={() => {
                            props.updateState({
                                selectedMod: {
                                    author: props.author,
                                    deprecated: props.deprecated,
                                    description: props.description,
                                    downloadURL: props.downloadURL,
                                    iconURL: props.iconURL,
                                    latestVersion: props.latestVersion,
                                    versions: props.versions,
                                    name: props.name,
                                    webURL: props.webURL
                                }
                            });
                        }}>
                        {Localize('buttons.moreInfo')}
                    </button>
                </div>
            </div>
            <p className='RemoteListCard__title'>{Filter(props.name)}</p>
        </div>
    );
};

export default RemoteListCard;
