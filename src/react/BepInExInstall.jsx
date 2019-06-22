import React from 'react';
import rp from 'request-promise';

import { gameInstallLocation } from '../api/settings.json';
import { Localize } from '../messages/index';

import '../styles/PopUp.css';

const app = window.require('electron').remote.app;
const fs = window.require('fs-extra');

const BepInExInstall = (props) => {
  return (
    <div className='PopUp'>
      <div className='PopUp__block'>
        <p>{Localize('actions.installBepInEx')}</p>
        <button
          onClick={() => {
            installBep(props);
          }}>
          {Localize('buttons.installBepInEx')}
        </button>
      </div>
    </div>
  );
};

const getMods = () => {
  return new Promise((resolve, reject) => {
    rp('https://thunderstore.io/api/v1/package/')
      .then((html) => {
        resolve(JSON.parse(html));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const installBep = async (props) => {
  const json = await getMods();
  let bep = null;
  for (const mod in json) {
    if (json[mod].name.toLowerCase() === 'bepinexpack') {
      bep = json[mod];
    }
  }
  if (bep) {
    props.updateStatus(`Downloading ${bep.name}...`);
    props.updateStatus(
      await props.downloadMod({
        name: bep.name,
        url: bep.versions[0].download_url
      })
    );
    props.updateStatus(`Extracting ${bep.name}`);
    props.updateStatus(
      await props.extractMod({
        name: bep.name,
        destination: `${app.getAppPath()}\\src\\cache\\${bep.name}`
      })
    );
    fs.copySync(
      `${app.getAppPath()}\\src\\cache\\${bep.name}\\${bep.name}`,
      gameInstallLocation
    );
    props.updateConfig({
      key: 'bepInstalled',
      value: true
    });
  }
};

export default BepInExInstall;
