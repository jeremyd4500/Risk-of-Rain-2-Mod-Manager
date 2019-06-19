import React from 'react';
import '../styles/ModCard.css';

const ModCard = (props) => {
  return (
    <div className='ModCard'>
      <div className='ModCard-Top'>
        <img src={props.iconURL} alt={props.iconURL} />
        <div className='ModCard-Top-Buttons'>
          <button
            onClick={async () => {
              props.installMod({ name: props.name, url: props.downloadURL });
            }}>
            Install
          </button>
          <button
            onClick={() => {
              props.updateSelectedMod({
                author: props.author,
                deprecated: props.deprecated,
                description: props.description,
                downloadURL: props.downloadURL,
                iconURL: props.iconURL,
                latestVersion: props.latestVersion,
                name: props.name,
                webURL: props.webURL
              });
            }}>
            More Info
          </button>
        </div>
      </div>
      <p>{props.name}</p>
    </div>
  );
};

export default ModCard;
