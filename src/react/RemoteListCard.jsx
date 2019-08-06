import React from 'react';
import { Localize, Filter } from '../utils';

import '../styles/RemoteListCard.css';

const RemoteListCard = (props) => {
    return (
        <div className='RemoteListCard'>
            <div className='RemoteListCard__top'>
                <img className='RRemoteListCard__top-image' src={props.iconURL} alt={props.name} />
                <div className='RemoteListCard__top-buttons'>
                    <button
                        className='RemoteListCard__top-buttons-button'
                        onClick={async () => {
                            const folderName = `ror2mm___${props.name}___${props.latestVersion}`;
                            props.installMod({
                                author: props.author,
                                deprecated: props.deprecated,
                                description: props.description,
                                destination: `${
                                    props.gameInstallLocation
                                }\\BepInEx\\plugins\\${folderName}`,
                                downloadURL: props.downloadURL,
                                folderName: folderName,
                                iconURL: props.iconURL,
                                latestVersion: props.latestVersion,
                                name: props.name,
                                version: props.latestVersion,
                                webURL: props.webURL
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
                                    name: props.name,
                                    versions: props.versions,
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
