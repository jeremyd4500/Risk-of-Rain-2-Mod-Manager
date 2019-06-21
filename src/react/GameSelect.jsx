import React from 'react';

import '../styles/GameSelect.css';

const dialog = window.require('electron').remote.dialog;

const GameSelect = (props) => {
  return (
    <div className='PopUp'>
      <div className='PopUp__block'>
        <p>Please select your Risk of Rain 2 install location</p>
        <button
          onClick={() => {
            selectDirectory(props.updateConfig);
          }}>
          Select Folder
        </button>
      </div>
    </div>
  );
};

const selectDirectory = (updateConfig) => {
  dialog.showOpenDialog(
    {
      properties: ['openDirectory']
    },
    async (folderLocation) => {
      if (folderLocation) {
        const status = await updateConfig({
          key: 'gameInstallLocation',
          value: folderLocation[0]
        });
        if (status.startsWith('ERROR')) {
          alert(status);
        }
      }
    }
  );
};

export default GameSelect;
