import React, { Component } from 'react';
import LocalListCard from './LocalListCard';
import SearchBar from './SearchBar';
import { Localize } from '../utils';

import '../styles/LocalList.css';

class LocalList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };
    }

    render() {
        return (
            <div className='Wrapper'>
                <p className='Wrapper__title'>{Localize('panels.installed')}</p>
                <div className='LocalList'>
                    <div className='LocalList__search'>
                        <SearchBar onChange={this.onSearchChange} />
                    </div>
                    <div className='LocalList__modList'>{this.renderInstalledMods(this.props)}</div>
                </div>
            </div>
        );
    }

    onSearchChange = (event) => {
        this.updateState({
            searchTerm: event.target.value
        });
    };

    renderInstalledMods = (props) => {
        const installedMods = [];

        JSON.parse(props.installedMods).forEach((mod) => {
            if (mod.name !== 'BepInExPack') {
                installedMods.push(mod);
            }
        });

        const cardList = [];

        installedMods.forEach((mod, modIndex) => {
            const card = (
                <LocalListCard
                    iconURL={mod.iconURL}
                    key={modIndex}
                    name={mod.name}
                    version={mod.version}
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
            component: 'LocalList',
            params: { ...params }
        });
        this.setState({ ...params });
    };
}

export default LocalList;
