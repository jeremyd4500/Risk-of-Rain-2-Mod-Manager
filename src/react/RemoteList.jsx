import React, { Component } from 'react';
import RemoteListCard from './RemoteListCard';
import SearchBar from './SearchBar';
import { Localize } from '../utils';

import '../styles/RemoteList.css';

class RemoteList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };
    }

    render() {
        if (this.props.loaded === 'false' && this.props.bepInstalled === 'true') {
            this.props.updateRemoteList();
            this.props.updateState({
                loaded: 'true'
            });
        }
        return (
            <div className='Wrapper'>
                <p className='Wrapper__title'>{Localize('panels.notInstalled')}</p>
                <div className='RemoteList'>
                    <div className='RemoteList__search'>
                        <SearchBar onChange={this.onSearchChange} />
                    </div>
                    <div className='RemoteList__modList'>{this.renderRemoteList(this.props)}</div>
                </div>
            </div>
        );
    }

    onSearchChange = (event) => {
        this.updateState({
            searchTerm: event.target.value
        });
    };

    renderRemoteList = (props) => {
        const modList = [];
        /*
        Remove all other mod managers from the list since it's 
        unlikely that they are meant to be installed the same way
        as normal mods
        */
        const blackList = [
            'mythicmodmanager',
            'bepinexpack',
            'gcmanager',
            'ror2modmanager',
            'meepens_mod_loader',
            'r2modman'
        ];

        JSON.parse(props.installedMods).forEach((mod) => {
            blackList.push(mod.name.toLowerCase());
        });

        let remoteList;
        if (typeof props.remoteList === 'string') {
            remoteList = JSON.parse(props.remoteList);
        } else {
            remoteList = props.remoteList;
        }

        for (const mod in remoteList) {
            if (!blackList.includes(remoteList[mod].name.toLowerCase())) {
                modList.push(remoteList[mod]);
            }
        }

        const cardList = [];

        modList.forEach((mod, modIndex) => {
            const card = (
                <RemoteListCard
                    author={mod.owner}
                    deprecated={mod.is_deprecated}
                    description={mod.versions[0].description}
                    downloadURL={mod.versions[0].download_url}
                    gameInstallLocation={props.gameInstallLocation}
                    iconURL={mod.versions[0].icon}
                    installMod={props.installMod}
                    key={modIndex}
                    latestVersion={mod.versions[0].version_number}
                    name={mod.name}
                    updateState={props.updateState}
                    versions={mod.versions}
                    webURL={mod.package_url}
                />
            );
            if (this.state.searchTerm) {
                if (mod.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                    cardList.push(card);
                }
            } else {
                cardList.push(card);
            }
        });

        return cardList;
    };

    updateState = (params) => {
        console.log({
            action: 'UPDATE_STATE',
            component: 'RemoteList',
            params: { ...params }
        });
        this.setState({ ...params });
    };
}

export default RemoteList;
