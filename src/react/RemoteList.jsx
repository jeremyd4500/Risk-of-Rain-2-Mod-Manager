import React from 'react';
import ModCard from './ModCard';

import '../styles/RemoteList.css';

const RemoteList = (props) => {
  if (!props.loaded) {
    props.fetchRemoteList();
    props.updateLoaded(true);
  }
  return (
    <div className='Wrapper'>
      <p>Not Installed</p>
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
    'meepens_mod_loader'
  ];
  for (const mod in json) {
    if (!blackList.includes(json[mod].name.toLowerCase())) {
      modList.push(json[mod]);
    }
  }
  return modList.map((mod, index) => {
    return (
      <ModCard
        key={index}
        name={mod.name}
        author={mod.owner}
        deprecated={mod.is_deprecated}
        webURL={mod.package_url}
        description={mod.versions[0].description}
        latestVersion={mod.versions[0].version_number}
        iconURL={mod.versions[0].icon}
        downloadURL={mod.versions[0].download_url}
        updateSelectedMod={props.updateSelectedMod}
      />
    );
  });
};

export default RemoteList;
