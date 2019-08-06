import React, { Component } from 'react';
import request from 'ajax-request';
import Header from './Header';
import RemoteList from './RemoteList';
import Description from './Description';
import LocalList from './LocalList';
import Log from './Log';
import GameSelect from './GameSelect';
import BepInExInstall from './BepInExInstall';
import Settings from './Settings';
import { Localize } from '../utils';

import '../styles/Main.css';
import '../styles/MiddleBlock.css';

class Main extends Component {
    constructor(props) {
        super(props);

        this.Functions = {
            extractMod: this.extractMod,
            downloadMod: this.downloadMod,
            getRemoteList: this.getRemoteList,
            installMod: this.installMod,
            mergeStateWithLocalStorage: this.mergeStateWithLocalStorage,
            updateConfigs: this.updateConfigs,
            updateState: this.updateState,
            updateConsoleStatus: this.updateConsoleStatus,
            updateRemoteList: this.updateRemoteList
        };

        this.state = {
            loaded: 'false',
            remoteList: {},
            selectedMod: null,
            showSettings: false,
            status: [],
            ...localStorage
        };
    }

    render() {
        return (
            <div className='Main'>
                <Header {...this.Functions} {...this.state} />
                <div className='MiddleBlock'>
                    <RemoteList {...this.Functions} {...this.state} />
                    <Description {...this.Functions} {...this.state} />
                    <LocalList {...this.Functions} {...this.state} />
                </div>
                <Log status={this.state.status} />
                {this.state.showSettings && <Settings {...this.Functions} {...this.state} />}
                {!this.state.gameInstallLocation && <GameSelect {...this.Functions} />}
                {this.state.gameInstallLocation && this.state.bepInstalled === 'false' && (
                    <BepInExInstall {...this.state} {...this.Functions} />
                )}
            </div>
        );
    }

    downloadMod = async (params) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: 'http://localhost:9001/api/download',
                    method: 'GET',
                    data: {
                        ...params
                    }
                },
                (err, res, body) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(body);
                    }
                }
            );
        });
    };

    extractMod = async (params) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: 'http://localhost:9001/api/extract',
                    method: 'GET',
                    data: {
                        ...params
                    }
                },
                (err, res, body) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(body);
                    }
                }
            );
        });
    };

    getRemoteList = async () => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: 'http://localhost:9001/api/fetchMods',
                    method: 'GET',
                    data: {}
                },
                (err, res, body) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(body);
                    }
                }
            );
        });
    };

    installMod = async (params) => {
        this.updateConsoleStatus(`Downloading ${params.name}...`);
        this.updateConsoleStatus(await this.downloadMod(params));
        this.updateConsoleStatus(`Extracting ${params.name}...`);
        this.updateConsoleStatus(await this.extractMod(params));
        this.mergeStateWithLocalStorage();
        this.updateState({
            selectedMod: null
        });
    };

    mergeStateWithLocalStorage = () => {
        this.updateState({ ...this.state, ...localStorage });
    };

    updateConfigs = async (params) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: 'http://localhost:9001/api/update',
                    method: 'GET',
                    data: params
                },
                (err, res, body) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (body.startsWith('ERROR')) {
                            reject(body);
                        } else {
                            resolve(body);
                        }
                    }
                    this.mergeStateWithLocalStorage();
                }
            );
        });
    };

    updateState = (params) => {
        console.log({
            action: 'UPDATE_STATE',
            component: 'Main',
            params: { ...params }
        });
        this.setState({ ...params });
    };

    updateConsoleStatus = (newStatus) => {
        newStatus = newStatus.replace(/"/g, '');
        this.setState((prevState) => {
            const CurrentTime = new Date();
            const ClockTime = `${CurrentTime.getHours().toString()}:${CurrentTime.getMinutes().toString()}:${CurrentTime.getSeconds().toString()}`;
            prevState.status.unshift(`[${ClockTime}] ${newStatus}`);
            return { status: prevState.status };
        });
    };

    updateRemoteList = async () => {
        this.updateConsoleStatus(Localize('statuses.startFetch'));
        const html = await this.getRemoteList();
        this.updateState({
            remoteList: html
        });
        this.updateConsoleStatus(Localize('statuses.endFetch'));
    };
}

export default Main;
