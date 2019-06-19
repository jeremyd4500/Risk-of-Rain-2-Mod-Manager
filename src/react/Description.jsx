import React from 'react';

import '../styles/Description.css';

const { shell } = window.require('electron');

const checkDeprecation = (deprecated) => {
  if (deprecated) {
    return (
      <p>
        <b>NOTE: </b>This mod has been deprecated
      </p>
    );
  }
};

const Description = (props) => {
  if (props.selectedMod) {
    return (
      <div className='Wrapper'>
        <p>Description</p>
        <div className='Description'>
          <button
            onClick={() => {
              shell.openExternal(props.selectedMod.webURL);
            }}>
            View On Thunderstore
          </button>
          <button
            onClick={async () => {
              props.installMod({
                name: props.selectedMod.name,
                url: props.selectedMod.downloadURL
              });
            }}>
            Install This Mod
          </button>
          {checkDeprecation(props.selectedMod.deprecated)}
          <p>
            <b>Name: </b>
            {props.selectedMod.name}
          </p>
          <p>
            <b>Author: </b>
            {props.selectedMod.author}
          </p>
          <p>
            <b>Description: </b>
            {props.selectedMod.description}
          </p>
          <p>
            <b>Latest Version: </b>
            {props.selectedMod.latestVersion}
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className='Wrapper'>
        <p>Description</p>
        <div className='Description' />
      </div>
    );
  }
};

export default Description;
