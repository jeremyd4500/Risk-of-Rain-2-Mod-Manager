import React from 'react';
import PropTypes from 'prop-types';

import OnOffSwitch from 'react-switch';

const Switch = ({ checked, onChange }) => (
    <OnOffSwitch
        checked={checked}
        checkedIcon={false}
        offColor={'#b2b2b3'}
        offHandleColor={'#ffffff'}
        onChange={onChange}
        onColor={'#b2b2b3'}
        onHandleColor={'#ffffff'}
        uncheckedIcon={false}
        width={40}
        height={15}
        handleDiameter={22}
    />
);

Switch.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Switch;
