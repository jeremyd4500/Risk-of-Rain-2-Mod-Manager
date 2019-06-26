import React from 'react';
import ModCard from './ModCard';
import { Localize } from '../utils';
import { bepInstalled } from '../utils/data/settings.json';

import '../styles/RemoteList.css';

const RemoteList = (props) => {
  if (!props.loaded && bepInstalled) {
    props.fetchRemoteList();
    props.updateLoaded(true);
  }
  return (
    <div className='Wrapper'>
      <p>{Localize('panels.notInstalled')}</p>
      <div className='RemoteList'>
        {renderRemoteList(props.remoteList, props)}
      </div>
    </div>
  );
};

const renderRemoteList = (json, props) => {
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
  for (const mod in json) {
    if (!blackList.includes(json[mod].name.toLowerCase())) {
      modList.push(json[mod]);
    }
  }
  return modList.map((mod, index) => {
    return (
      <ModCard
        author={mod.owner}
        deprecated={mod.is_deprecated}
        description={mod.versions[0].description}
        downloadURL={mod.versions[0].download_url}
        iconURL={mod.versions[0].icon}
        installMod={props.installMod}
        key={index}
        latestVersion={mod.versions[0].version_number}
        name={mod.name}
        updateSelectedMod={props.updateSelectedMod}
        webURL={mod.package_url}
      />
    );
  });
};

export default RemoteList;
