import React from 'react';
import { Localize, Filter } from '../utils';

import '../styles/RemoteListCard.css';

const RemoteListCard = (props) => {
    return (
        <div className='RemoteListCard'>
            <div className='RemoteListCard-Top'>
                <img className='RemoteListCard-Top-Img' src={props.iconURL} alt={props.iconURL} />
                <div className='RemoteListCard-Top-Buttons'>
                    <button
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
                        onClick={() => {
                            props.updateStateValue({
                                key: 'selectedMod',
                                value: {
                                    author: props.author,
                                    deprecated: props.deprecated,
                                    description: props.description,
                                    downloadURL: props.downloadURL,
                                    iconURL: props.iconURL,
                                    latestVersion: props.latestVersion,
                                    name: props.name,
                                    webURL: props.webURL
                                }
                            });
                        }}>
                        {Localize('buttons.moreInfo')}
                    </button>
                </div>
            </div>
            <p className='RemoteListCard-Name'>{Filter(props.name)}</p>
        </div>
    );
};

export default RemoteListCard;
