import React, { Component } from 'react';
import rp from 'request-promise';
import request from 'ajax-request';

import Header from './Header';
import RemoteList from './RemoteList';
import Description from './Description';
import LocalList from './LocalList';
import Console from './Console';

import '../styles/Main.css';
import '../styles/MiddleBlock.css';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      remoteList: {},
      selectedMod: null,
      status: []
    };
  }

  render() {
    const Functions = {
      fetchRemoteList: this.fetchRemoteList,
      installMod: this.installMod,
      updateLoaded: this.updateLoaded,
      updateSelectedMod: this.updateSelectedMod,
      updateStatus: this.updateStatus
    };

    return (
      <div className='Main'>
        <Header title='RoR2 Mod Manager' {...Functions} />
        <div className='MiddleBlock'>
          <RemoteList title='Not Installed' {...Functions} {...this.state} />
          <Description title='Description' {...Functions} {...this.state} />
          <LocalList title='Installed' {...this.state} />
        </div>
        <Console status={this.state.status} />
      </div>
    );
  }

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
    await request(
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
          alert(err);
        } else {
          this.updateStatus(body);
          // either continue here or figure out how to wait for request() to finish
        }
      }
    );
  };

  updateLoaded = (newValue) => {
    this.setState((prevState) => {
      prevState.loaded = newValue;
      return { loaded: prevState.loaded };
    });
  };

  updateRemoteList = (json) => {
    this.setState((prevState) => {
      prevState.remoteList = json;
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
}

export default Main;
