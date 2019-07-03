import React, { Component } from 'react';
import rp from 'request-promise';
import request from 'ajax-request';

import Header from './Header';
import RemoteList from './RemoteList';
import Description from './Description';
import LocalList from './LocalList';
import Log from './Log';
import GameSelect from './GameSelect';
import BepInExInstall from './BepInExInstall';

import { Localize } from '../utils';

import '../styles/Main.css';
import '../styles/MiddleBlock.css';

class Main extends Component {
    constructor(props) {
        super(props);

        this.Functions = {
            extractMod: this.extractMod,
            downloadMod: this.downloadMod,
            fetchRemoteList: this.fetchRemoteList,
            installMod: this.installMod,
            mergeStateWithLocalStorage: this.mergeStateWithLocalStorage,
            updateConfig: this.updateConfig,
            updateMultipleConfigs: this.updateMultipleConfigs,
            updateStateValue: this.updateStateValue,
            updateConsoleStatus: this.updateConsoleStatus
        };

        this.state = {
            loaded: 'false',
            remoteList: {},
            selectedMod: null,
            status: [],
            ...localStorage
        };
    }

    render() {
        console.log(this.state);
        return (
            <div className='Main'>
                <Header {...this.Functions} />
                <div className='MiddleBlock'>
                    <RemoteList {...this.Functions} {...this.state} />
                    <Description {...this.Functions} {...this.state} />
                    <LocalList {...this.Functions} {...this.state} />
                </div>
                <Log status={this.state.status} />
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
                        name: params.name,
                        url: params.url
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
                        destination: params.destination,
                        iconURL: params.iconURL,
                        name: params.name,
                        version: params.version
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

    fetchRemoteList = async () => {
        this.updateConsoleStatus(Localize('statuses.startFetch'));
        try {
            rp('https://thunderstore.io/api/v1/package/')
                .then((html) => {
                    this.updateStateValue({
                        key: 'remoteList',
                        value: JSON.parse(html)
                    });
                    this.updateConsoleStatus(Localize('statuses.endFetch'));
                })
                .catch((error) => {
                    alert(error);
                });
        } catch (err) {
            console.log(err);
        }
    };

    installMod = async (params) => {
        this.updateConsoleStatus(`Downloading ${params.name}...`);
        this.updateConsoleStatus(await this.downloadMod(params));
        this.updateConsoleStatus(`Extracting ${params.name}...`);
        this.updateConsoleStatus(await this.extractMod(params));
    };

    mergeStateWithLocalStorage = () => {
        this.setState({ ...this.state, ...localStorage });
    };

    updateConfig = async (params) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: 'http://localhost:9001/api/update',
                    method: 'GET',
                    data: {
                        key: params.key,
                        value: params.value
                    }
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

    updateMultipleConfigs = async (params) => {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: 'http://localhost:9001/api/updateMultiple',
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

    updateStateValue = (params) => {
        this.setState((prevState) => {
            prevState[params.key] = params.value;
            return { [params.key]: prevState[params.key] };
        });
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
}

export default Main;
