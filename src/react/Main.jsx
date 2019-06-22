import React, { Component } from 'react';
import rp from 'request-promise';
import request from 'ajax-request';

import Header from './Header';
import RemoteList from './RemoteList';
import Description from './Description';
import LocalList from './LocalList';
import Console from './Console';
import GameSelect from './GameSelect';
import BepInExInstall from './BepInExInstall';

import { bepInstalled } from '../api/settings.json';
import { gameInstallLocation } from '../api/settings.json';
import { Localize } from '../messages/index';

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
        <Header {...this.Functions} />
        <div className='MiddleBlock'>
          <RemoteList {...this.Functions} {...this.state} />
          <Description {...this.Functions} {...this.state} />
          <LocalList {...this.state} />
        </div>
        <Console status={this.state.status} />
        {this.verifyGameInstall()}
        {this.verifyBepInEx()}
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

  extractMod = (params) => {
    return new Promise((resolve, reject) => {
      request(
        {
          url: 'http://localhost:9001/api/extract',
          method: 'GET',
          data: {
            name: params.name,
            destination: params.destination
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
    this.updateStatus(Localize('statuses.startFetch'));
    rp('https://thunderstore.io/api/v1/package/')
      .then((html) => {
        this.updateRemoteList(JSON.parse(html));
        this.updateStatus(Localize('statuses.endFetch'));
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

  verifyBepInEx = () => {
    if (gameInstallLocation && !bepInstalled) {
      return <BepInExInstall {...this.Functions} />;
    }
  };

  verifyGameInstall = () => {
    if (!gameInstallLocation) {
      return <GameSelect {...this.Functions} />;
    }
  };
}

export default Main;
