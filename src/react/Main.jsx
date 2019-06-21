import React, { Component } from 'react';
import rp from 'request-promise';
import request from 'ajax-request';

import Header from './Header';
import RemoteList from './RemoteList';
import Description from './Description';
import LocalList from './LocalList';
import Console from './Console';
import GameSelect from './GameSelect';

import { gameInstallLocation } from '../config.json';

import '../styles/Main.css';
import '../styles/MiddleBlock.css';

class Main extends Component {
  constructor(props) {
    super(props);

    this.Functions = {
      fetchRemoteList: this.fetchRemoteList,
      installMod: this.installMod,
      updateConfig: this.updateConfig,
      updateLoaded: this.updateLoaded,
      updateSelectedMod: this.updateSelectedMod,
      updateStatus: this.updateStatus
    };

    this.state = {
      loaded: false,
      remoteList: {},
      selectedMod: null,
      status: []
    };
  }

  render() {
    return (
      <div className='Main'>
        <Header title='RoR2 Mod Manager' {...this.Functions} />
        <div className='MiddleBlock'>
          <RemoteList
            title='Not Installed'
            {...this.Functions}
            {...this.state}
          />
          <Description
            title='Description'
            {...this.Functions}
            {...this.state}
          />
          <LocalList title='Installed' {...this.state} />
        </div>
        <Console status={this.state.status} />
        {this.verifyGameInstall()}
      </div>
    );
  }

  downloadMod = (params) => {
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

  fetchRemoteList = async () => {
    this.updateStatus('Fetching mods from Thunderstore.io...');
    rp('https://thunderstore.io/api/v1/package/')
      .then((html) => {
        this.updateRemoteList(JSON.parse(html));
        this.updateStatus('Finished fetching mods.');
      })
      .catch((error) => {
        alert(error);
      });
  };

  installMod = async (params) => {
    this.updateStatus(`Downloading ${params.name}...`);
    this.updateStatus(await this.downloadMod(params));
  };

  updateConfig = (params) => {
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
        }
      );
    });
  };

  updateLoaded = (newValue) => {
    this.setState((prevState) => {
      prevState.loaded = newValue;
      return { loaded: prevState.loaded };
    });
  };

  updateRemoteList = (newRemoteList) => {
    this.setState((prevState) => {
      prevState.remoteList = newRemoteList;
      return { remoteList: prevState.remoteList };
    });
  };

  updateSelectedMod = (mod) => {
    this.setState((prevState) => {
      prevState.selectedMod = mod;
      return { selectedMod: prevState.selectedMod };
    });
  };

  updateStatus = (newStatus) => {
    newStatus = newStatus.replace(/"/g, '');
    this.setState((prevState) => {
      const CurrentTime = new Date();
      const ClockTime =
        CurrentTime.getHours().toString() +
        ':' +
        CurrentTime.getMinutes().toString() +
        ':' +
        CurrentTime.getSeconds().toString();
      prevState.status.unshift(`[${ClockTime}] ${newStatus}`);
      return { status: prevState.status };
    });
  };

  verifyGameInstall = () => {
    if (!gameInstallLocation) {
      return <GameSelect updateConfig={this.updateConfig} />;
    }
  };
}

export default Main;
